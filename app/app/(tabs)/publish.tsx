import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import TabHeader from '@/components/TabHeader';
import MapPickerModal from '@/components/MapPickerModal';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { tripsApi } from '@/api/trips';

const { width } = Dimensions.get('window');

export default function PublishTripScreen() {
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const { token } = useAuth();

  const [originName, setOriginName] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [originLat, setOriginLat] = useState<number | null>(null);
  const [originLng, setOriginLng] = useState<number | null>(null);
  const [destinationLat, setDestinationLat] = useState<number | null>(null);
  const [destinationLng, setDestinationLng] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [totalSeats, setTotalSeats] = useState(4);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapMode, setMapMode] = useState<'origin' | 'destination'>('origin');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const openMapModal = useCallback((mode: 'origin' | 'destination') => {
    setMapMode(mode);
    setShowMapModal(true);
  }, []);

  const handleMapConfirm = useCallback(async (lat: number, lng: number, name: string) => {
    setShowMapModal(false);

    try {
      const response = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const address = response.length > 0
        ? [response[0].street, response[0].city, response[0].region].filter(Boolean).join(', ')
        : name;

      if (mapMode === 'origin') {
        setOriginName(address);
        setOriginLat(lat);
        setOriginLng(lng);
      } else {
        setDestinationName(address);
        setDestinationLat(lat);
        setDestinationLng(lng);
      }
    } catch {
      if (mapMode === 'origin') {
        setOriginName(name);
        setOriginLat(lat);
        setOriginLng(lng);
      } else {
        setDestinationName(name);
        setDestinationLat(lat);
        setDestinationLng(lng);
      }
    }
  }, [mapMode]);

  const useMyLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu ubicacion para usar esta funcion.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      const name = response.length > 0
        ? [response[0].street, response[0].city].filter(Boolean).join(', ')
        : 'Mi ubicacion';

      setOriginName(name);
      setOriginLat(latitude);
      setOriginLng(longitude);
    } catch {
      Alert.alert('Error', 'No se pudo obtener tu ubicacion actual.');
    }
  }, []);

  const formatDate = (d: Date): string => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (d: Date): string => {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setDate(formatDate(date));
    }
  };

  const handleTimeChange = (_event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
      setDepartureTime(formatTime(time));
    }
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!originName || !destinationName || !date || !departureTime || !price || originLat === null || destinationLat === null) {
      Alert.alert('Error', t.publish.fillRequired);
      return;
    }

    const priceNum = parseInt(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Ingresa un precio valido');
      return;
    }

    const [day, month, year] = date.split('/').map(Number);
    const [hours, minutes] = departureTime.split(':').map(Number);
    const departureDate = new Date(year, month - 1, day, hours, minutes);
    if (isNaN(departureDate.getTime()) || departureDate <= new Date()) {
      Alert.alert('Error', 'Selecciona una fecha y hora valida');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Debes iniciar sesion para publicar un viaje');
      return;
    }

    Alert.alert(
      t.publish.publishConfirm,
      t.publish.publishConfirmMsg.replace('${price}', `$${priceNum.toLocaleString('es-CO')}`),
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.confirm,
          onPress: async () => {
            setIsPublishing(true);
            try {
              await tripsApi.createTrip(token, {
                origin_name: originName,
                origin_lat: originLat,
                origin_lng: originLng!,
                destination_name: destinationName,
                destination_lat: destinationLat,
                destination_lng: destinationLng!,
                departure_time: departureDate.toISOString(),
                total_seats: totalSeats,
                price: priceNum,
                notes: notes || undefined,
              });

              Alert.alert(t.common.success, t.publish.publishSuccess, [
                { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo publicar el viaje');
            } finally {
              setIsPublishing(false);
            }
          },
        },
      ]
    );
  };

  const NumberSelector = ({ value, onIncrement, onDecrement, label, min = 1, max = 7 }: any) => (
    <View style={styles.numberSelector}>
      <Text style={[styles.label, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.medium, fontFamily: typography.family.medium }]}>{label}</Text>
      <View style={styles.selectorRow}>
        <TouchableOpacity
          style={[styles.selectorBtn, { borderColor: colors.border.default }, value <= min && styles.selectorBtnDisabled]}
          onPress={onDecrement}
          disabled={value <= min}
        >
          <Ionicons name="remove" size={20} color={value <= min ? colors.text.muted : colors.secondary.default} />
        </TouchableOpacity>
        <Text style={[styles.selectorValue, { color: colors.text.primary, fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{value}</Text>
        <TouchableOpacity
          style={[styles.selectorBtn, { borderColor: colors.border.default }, value >= max && styles.selectorBtnDisabled]}
          onPress={onIncrement}
          disabled={value >= max}
        >
          <Ionicons name="add" size={20} color={value >= max ? colors.text.muted : colors.secondary.default} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const LocationPicker = ({ mode, name, color }: { mode: 'origin' | 'destination'; name: string; color: string }) => {
    const hasLocation = name.length > 0;

    return (
      <View style={styles.locationPicker}>
        <TouchableOpacity
          style={[
            styles.locationButton,
            { backgroundColor: colors.background.card, borderColor: colors.border.default, borderWidth: 1 },
          ]}
          onPress={() => openMapModal(mode)}
        >
          <Ionicons name={mode === 'origin' ? 'location' : 'flag'} size={20} color={color} />
          <Text
            style={[
              styles.locationButtonText,
              { color: hasLocation ? colors.text.primary : colors.text.muted, fontSize: typography.sizes.md, fontFamily: typography.family.regular },
            ]}
            numberOfLines={1}
          >
            {name || 'Toca para seleccionar en mapa'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
        </TouchableOpacity>
        {mode === 'origin' && hasLocation && (
          <TouchableOpacity style={styles.useMyLocBtn} onPress={useMyLocation}>
            <Ionicons name="locate" size={16} color={colors.secondary.default} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <TabHeader />

      <MapPickerModal
        visible={showMapModal}
        mode={mapMode}
        onConfirm={handleMapConfirm}
        onCancel={() => setShowMapModal(false)}
      />

      <ScrollView style={styles.content}>
        <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.publish.route}</Text>

          <LocationPicker mode="origin" name={originName} color={colors.tertiary.default} />
          <LocationPicker mode="destination" name={destinationName} color={colors.secondary.default} />
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.publish.dateTime}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, ...shadow.sm, borderColor: colors.border.default }]}>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.background.default, borderColor: colors.border.default }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.secondary.default} />
              <Text style={[styles.dateText, { color: colors.text.primary, fontSize: typography.sizes.md, fontFamily: typography.family.medium }, !date && { color: colors.text.muted }]}>
                {date || t.publish.selectDate}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.background.default, borderColor: colors.border.default }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color={colors.secondary.default} />
              <Text style={[styles.dateText, { color: colors.text.primary, fontSize: typography.sizes.md, fontFamily: typography.family.medium }, !departureTime && { color: colors.text.muted }]}>
                {departureTime || t.publish.departureTime}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.publish.seatsPrice}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, ...shadow.sm, borderColor: colors.border.default }]}>
            <NumberSelector
              value={totalSeats}
              label={t.publish.seatCount}
              onIncrement={() => setTotalSeats(prev => prev + 1)}
              onDecrement={() => setTotalSeats(prev => Math.max(1, prev - 1))}
              max={4}
            />
            <Text style={[styles.inputLabel, { color: colors.text.primary, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{t.publish.pricePerPerson}</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.background.default, borderColor: colors.border.default }]}>
              <Text style={[styles.currencySymbol, { color: colors.tertiary.default, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>$</Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary, fontSize: typography.sizes.md, fontFamily: typography.family.regular }]}
                placeholder="0"
                placeholderTextColor={colors.text.muted}
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.publish.additionalNotes}</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.background.card, borderColor: colors.border.default, color: colors.text.primary, fontSize: typography.sizes.md, fontFamily: typography.family.regular }]}
            placeholder={t.publish.notesPlaceholder}
            placeholderTextColor={colors.text.muted}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.publishSection, { paddingHorizontal: spacing.lg }]}>
          <TouchableOpacity
            style={[styles.publishButton, { backgroundColor: isPublishing ? colors.border.default : colors.tertiary.default, ...shadow.md }]}
            onPress={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <ActivityIndicator size="small" color={colors.primary.contrast} />
            ) : (
              <>
                <Ionicons name="send-outline" size={20} color={colors.primary.contrast} />
                <Text style={[styles.publishButtonText, { color: colors.primary.contrast, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{t.publish.publishTrip}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  section: { marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.sm },
  locationPicker: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  locationButton: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  locationButtonText: { flex: 1, marginLeft: spacing.sm },
  useMyLocBtn: { padding: spacing.sm, marginLeft: spacing.xs },
  card: { borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1 },
  inputLabel: { marginBottom: spacing.sm, marginTop: spacing.sm },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.sm },
  currencySymbol: { marginRight: spacing.xs },
  input: { flex: 1, paddingVertical: spacing.md },
  textInput: { minHeight: 60, paddingTop: spacing.md, borderWidth: 1, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  dateButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md, marginBottom: spacing.sm },
  dateText: { marginLeft: spacing.sm },
  numberSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  label: {},
  selectorRow: { flexDirection: 'row', alignItems: 'center' },
  selectorBtn: { width: 40, height: 40, borderRadius: borderRadius.full, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  selectorBtnDisabled: { opacity: 0.4 },
  selectorValue: { marginHorizontal: spacing.lg },
  publishSection: { paddingTop: spacing.md },
  publishButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.md, paddingVertical: spacing.md },
  publishButtonText: { marginLeft: spacing.sm },
});
