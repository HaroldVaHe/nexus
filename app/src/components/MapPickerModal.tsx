import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { borderRadius, spacing } from '@/theme/colors';

type MapPickerModalProps = {
  visible: boolean;
  mode: 'origin' | 'destination';
  onConfirm: (lat: number, lng: number, name: string) => void;
  onCancel: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { height: 100%; width: 100%; }
    .center-pin {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -100%);
      z-index: 1000;
      pointer-events: none;
    }
    .crosshair-label {
      position: fixed;
      bottom: 80px;
      left: 0; right: 0;
      text-align: center;
      z-index: 1000;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }
    .leaflet-control-attribution { display: none !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <div class="center-pin" id="centerPin">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="46" viewBox="0 0 32 46">
      <defs>
        <filter id="shadow" x="-50%" y="-10%" width="200%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
        </filter>
      </defs>
      <path id="pinPath" fill="#6366F1" stroke="#fff" stroke-width="2.5" filter="url(#shadow)" d="M16 0C7.2 0 0 7.2 0 16c0 12 16 30 16 30s16-18 16-30C32 7.2 24.8 0 16 0z"/>
      <circle fill="#fff" cx="16" cy="16" r="7"/>
    </svg>
  </div>
  <div class="crosshair-label" id="label">Mueve el mapa para ubicar el punto</div>

  <script>
    var map = L.map('map', {
      zoomControl: true,
      attributionControl: false,
      center: [4.8255, -74.0325],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    var currentColor = '#6366F1';
    var selectedMarker = null;

    function setMode(mode) {
      currentColor = mode === 'origin' ? '#0D9488' : '#6366F1';
      document.getElementById('pinPath').setAttribute('fill', currentColor);
      var label = mode === 'origin'
        ? 'Selecciona el punto de ORIGEN'
        : 'Selecciona el punto de DESTINO';
      document.getElementById('label').textContent = label;
    }

    map.on('moveend', function() {
      var center = map.getCenter();
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'center',
        lat: center.lat,
        lng: center.lng
      }));
    });

    function setSelected(lat, lng) {
      if (selectedMarker) {
        selectedMarker.setLatLng([lat, lng]);
      } else {
        selectedMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="46" viewBox="0 0 32 46">' +
              '<path fill="' + currentColor + '" stroke="#fff" stroke-width="2.5" d="M16 0C7.2 0 0 7.2 0 16c0 12 16 30 16 30s16-18 16-30C32 7.2 24.8 0 16 0z"/>' +
              '<circle fill="#fff" cx="16" cy="16" r="7"/></svg>',
            className: '',
            iconSize: [32, 46],
            iconAnchor: [16, 46],
          })
        }).addTo(map);
      }
    }

    window.addEventListener('message', function(event) {
      try {
        var data = JSON.parse(event.data);
        if (data.type === 'setMode') setMode(data.mode);
        if (data.type === 'confirm') {
          var center = map.getCenter();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'confirm',
            lat: center.lat,
            lng: center.lng
          }));
        }
        if (data.type === 'setView') {
          map.setView([data.lat, data.lng], data.zoom || 14);
        }
        if (data.type === 'setSelected') {
          setSelected(data.lat, data.lng);
        }
      } catch(e) {}
    });
  </script>
</body>
</html>
`;

export default function MapPickerModal({ visible, mode, onConfirm, onCancel }: MapPickerModalProps) {
  const { colors, typography } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      setSelectedCoords(null);
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({ type: 'setMode', mode }));
      }
    }
  }, [visible, mode]);

  const sendToWeb = useCallback((type: string, data: Record<string, unknown>) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type, ...data }));
    }
  }, []);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'center') {
        setSelectedCoords({ lat: data.lat, lng: data.lng });
      }
      if (data.type === 'confirm') {
        handleConfirm();
      }
    } catch {}
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedCoords) {
      const name = `${selectedCoords.lat.toFixed(5)}, ${selectedCoords.lng.toFixed(5)}`;
      onConfirm(selectedCoords.lat, selectedCoords.lng, name);
    }
  }, [selectedCoords, onConfirm]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel} activeOpacity={0.7}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF', fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>
            {mode === 'origin' ? 'Seleccionar Origen' : 'Seleccionar Destino'}
          </Text>
          <TouchableOpacity
            style={[styles.confirmBtn, !selectedCoords && { opacity: 0.5 }]}
            onPress={handleConfirm}
            disabled={!selectedCoords}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.secondary.default} />
            </View>
          )}
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: MAP_HTML }}
            style={styles.webview}
            onMessage={handleMessage}
            onLoadEnd={() => setIsLoading(false)}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
          />
        </View>

        {selectedCoords && (
          <View style={[styles.coordsBar, { backgroundColor: colors.background.card, borderTopColor: colors.border.default }]}>
            <View style={styles.coordsInfo}>
              <Ionicons name="location" size={18} color={mode === 'origin' ? '#0D9488' : '#6366F1'} />
              <Text style={[styles.coordsText, { color: colors.text.primary, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>
                {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#0F172A',
  },
  closeBtn: { padding: spacing.xs },
  headerTitle: {},
  confirmBtn: { padding: spacing.xs },
  mapContainer: { flex: 1 },
  webview: { flex: 1 },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    zIndex: 10,
  },
  coordsBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  coordsInfo: { flexDirection: 'row', alignItems: 'center' },
  coordsText: { marginLeft: spacing.sm },
});
