import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type MapMarker = {
  lat: number;
  lng: number;
  color: string;
  id: string;
};

type LeafletMapProps = {
  markers: MapMarker[];
  onMapPress?: (lat: number, lng: number) => void;
  selectionMode: boolean;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
};

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { height: 100%; width: 100%; }
    .selection-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 1000;
      display: none;
    }
    .selection-overlay.active {
      display: block;
    }
    .crosshair {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 32px; height: 32px;
      z-index: 1001;
      display: none;
      pointer-events: none;
    }
    .crosshair.active { display: block; }
    .crosshair::before, .crosshair::after {
      content: '';
      position: absolute;
      background: #6366F1;
    }
    .crosshair::before {
      width: 2px; height: 100%;
      left: 50%; transform: translateX(-50%);
    }
    .crosshair::after {
      height: 2px; width: 100%;
      top: 50%; transform: translateY(-50%);
    }
    .leaflet-control-zoom { display: none; }
  </style>
</head>
<body>
  <div id="map"></div>
  <div class="selection-overlay" id="overlay"></div>
  <div class="crosshair" id="crosshair"></div>

  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
    }).setView([4.8255, -74.0325], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    var markers = {};
    var selectionMode = false;

    function createIcon(color) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="38" viewBox="0 0 24 38">' +
        '<path fill="' + color + '" stroke="#fff" stroke-width="2" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 26 12 26s12-17 12-26C24 5.4 18.6 0 12 0z"/>' +
        '<circle fill="#fff" cx="12" cy="12" r="5"/>' +
        '</svg>';
      return L.divIcon({
        html: svg,
        className: '',
        iconSize: [24, 38],
        iconAnchor: [12, 38],
      });
    }

    function addMarker(id, lat, lng, color) {
      if (markers[id]) {
        markers[id].setLatLng([lat, lng]);
      } else {
        markers[id] = L.marker([lat, lng], { icon: createIcon(color) }).addTo(map);
      }
    }

    function removeMarker(id) {
      if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
      }
    }

    function updateMarkers(data) {
      var currentIds = data.map(function(m) { return m.id; });
      for (var id in markers) {
        if (currentIds.indexOf(id) === -1) {
          removeMarker(id);
        }
      }
      data.forEach(function(m) {
        addMarker(m.id, m.lat, m.lng, m.color);
      });
      if (data.length > 0) {
        var group = L.featureGroup(data.map(function(m) { return markers[m.id]; }));
        map.fitBounds(group.getBounds().pad(0.3));
      }
    }

    function setSelectionMode(active) {
      selectionMode = active;
      document.getElementById('overlay').className = active ? 'selection-overlay active' : 'selection-overlay';
      document.getElementById('crosshair').className = active ? 'crosshair active' : 'crosshair';
      map.dragging.enabled(!active);
      map.touchZoom.enabled(!active);
      map.scrollWheelZoom.enabled(!active);
    }

    function getCenterLat() {
      return map.getCenter().lat;
    }

    document.getElementById('overlay').addEventListener('click', function() {
      if (selectionMode) {
        var center = map.getCenter();
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'press',
          lat: center.lat,
          lng: center.lng
        }));
      }
    });

    map.on('click', function(e) {
      if (selectionMode) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'press',
          lat: e.latlng.lat,
          lng: e.latlng.lng
        }));
      }
    });

    window.addEventListener('message', function(event) {
      try {
        var data = JSON.parse(event.data);
        if (data.type === 'updateMarkers') updateMarkers(data.markers);
        if (data.type === 'setSelectionMode') setSelectionMode(data.active);
        if (data.type === 'setView') {
          map.setView([data.lat, data.lng], data.zoom || 13);
        }
      } catch(e) {}
    });
  </script>
</body>
</html>
`;

export default function LeafletMap({ markers, onMapPress, selectionMode, centerLat = 4.8255, centerLng = -74.0325, zoom = 13 }: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);
  const markersRef = useRef<MapMarker[]>([]);
  const selectionRef = useRef(false);

  React.useEffect(() => {
    markersRef.current = markers;
    sendToWeb('updateMarkers', { markers });
  }, [markers]);

  React.useEffect(() => {
    selectionRef.current = selectionMode;
    sendToWeb('setSelectionMode', { active: selectionMode });
  }, [selectionMode]);

  React.useEffect(() => {
    sendToWeb('setView', { lat: centerLat, lng: centerLng, zoom });
  }, []);

  const sendToWeb = useCallback((type: string, data: Record<string, unknown>) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type, ...data }));
    }
  }, []);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'press' && onMapPress) {
        onMapPress(data.lat, data.lng);
      }
    } catch {}
  }, [onMapPress]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: MAP_HTML }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
