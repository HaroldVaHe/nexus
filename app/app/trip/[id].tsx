import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useSettings();
  const { colors, typography } = useTheme();

  const trip = {
    id: id as string,
    driver_name: 'Carlos Martínez',
    driver_faculty: 'Ingeniería',
    driver_rating: 4.8,
    driver_trips: 45,
    origin: 'Centro Comercial Fontanar',
    origin_detail: 'Entrada principal, frente a la estación de policía',
    destination: 'Universidad de La Sabana',
    destination_detail: 'Entrada principal, puente peatonal',
    departure_time: '7:00 AM',
    arrival_time: '7:45 AM',
    date: 'Hoy, 4 de Mayo 2026',
    available_seats: 3,
    total_seats: 4,
    price: 8000,
    vehicle: 'Chevrolet Spark GT - Blanco',
    plate: 'ABC 123',
    notes: 'Paso por el puente peatonal del norte. Llevo maletas pequeñas sin problema.',
  };

  const handleBook = () => {
    Alert.alert(
      t.trip.confirmBooking,
      t.trip.confirmBookingMsg.replace('${price}', `$${trip.price.toLocaleString('es-CO')}`),
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.confirm,
          onPress: () => {
            Alert.alert(t.common.success, t.trip.bookingSuccess);
            router.replace('/bookings');
          },
        },
      ]
    );
  };

  const handleReport = () => {
    router.push(`/report/${trip.id}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <View style={[styles.header, { backgroundColor: colors.primary.default }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary.contrast, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{t.trip.title}</Text>
        <TouchableOpacity onPress={handleReport} style={styles.backButton}>
          <Ionicons name="flag-outline" size={20} color={colors.primary.contrast} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.driverSection, { backgroundColor: colors.background.card }]}>
          <View style={[styles.driverAvatar, { backgroundColor: colors.secondary.default }]}>
            <Text style={[styles.avatarText, { color: colors.primary.contrast, fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{trip.driver_name.charAt(0)}</Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={[styles.driverName, { color: colors.text.primary, fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{trip.driver_name}</Text>
            <Text style={[styles.driverFaculty, { color: colors.text.muted, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{trip.driver_faculty}</Text>
            <View style={styles.driverStats}>
              <View style={[styles.statBadge, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={[styles.statText, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>{trip.driver_rating}</Text>
              </View>
<Text style={[styles.statText, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>
               {trip.driver_trips} {t.trip.trips}
             </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.trip.route}</Text>
          <View style={[styles.routeCard, { backgroundColor: colors.background.card, ...shadow.sm }]}>
            <View style={styles.routePoint}>
              <View style={styles.dotContainer}>
                <View style={[styles.dot, { backgroundColor: colors.tertiary.default }]} />
                {true && <View style={[styles.dottedLine, { backgroundColor: colors.border.default }]} />}
              </View>
              <View style={styles.routeDetails}>
                <Text style={[styles.routeLabel, { color: colors.text.muted, fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, fontFamily: typography.family.medium, textTransform: 'uppercase', letterSpacing: 0.5 }]}>{t.trip.origin}</Text>
                <Text style={[styles.routeName, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{trip.origin}</Text>
                <Text style={[styles.routeSubtext, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{trip.origin_detail}</Text>
              </View>
            </View>
            <View style={styles.routePoint}>
              <View style={styles.dotContainer}>
                <View style={[styles.dot, { backgroundColor: colors.secondary.default }]} />
              </View>
              <View style={styles.routeDetails}>
                <Text style={[styles.routeLabel, { color: colors.text.muted, fontSize: typography.sizes.xs, fontWeight: typography.weights.medium, fontFamily: typography.family.medium, textTransform: 'uppercase', letterSpacing: 0.5 }]}>{t.trip.destination}</Text>
                <Text style={[styles.routeName, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{trip.destination}</Text>
                <Text style={[styles.routeSubtext, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{trip.destination_detail}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.trip.schedule}</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.background.card, ...shadow.sm }]}>
            <View style={[styles.infoRow, { paddingVertical: spacing.sm, paddingHorizontal: spacing.md }]}>
              <Ionicons name="calendar-outline" size={20} color={colors.secondary.default} />
              <Text style={[styles.infoLabel, { color: colors.text.muted, marginLeft: spacing.md, width: 80, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{t.trip.date}</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary, flex: 1, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>{trip.date}</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <View style={[styles.infoRow, { paddingVertical: spacing.sm, paddingHorizontal: spacing.md }]}>
              <Ionicons name="time-outline" size={20} color={colors.secondary.default} />
              <Text style={[styles.infoLabel, { color: colors.text.muted, marginLeft: spacing.md, width: 80, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{t.trip.time}</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary, flex: 1, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>{trip.departure_time} - {trip.arrival_time}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.trip.vehicle}</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.background.card, ...shadow.sm }]}>
            <View style={[styles.infoRow, { paddingVertical: spacing.sm, paddingHorizontal: spacing.md }]}>
              <Ionicons name="car-sport-outline" size={20} color={colors.secondary.default} />
              <Text style={[styles.infoLabel, { color: colors.text.muted, marginLeft: spacing.md, width: 80, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{t.trip.vehicle}</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary, flex: 1, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>{trip.vehicle}</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <View style={[styles.infoRow, { paddingVertical: spacing.sm, paddingHorizontal: spacing.md }]}>
              <Ionicons name="information-circle-outline" size={20} color={colors.secondary.default} />
              <Text style={[styles.infoLabel, { color: colors.text.muted, marginLeft: spacing.md, width: 80, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{t.trip.plate}</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary, flex: 1, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>{trip.plate}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.trip.availableSeats}</Text>
          <View style={[styles.seatsContainer, { backgroundColor: colors.background.card, ...shadow.sm, gap: spacing.sm }]}>
            {[...Array(trip.total_seats)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < trip.available_seats ? 'person' : 'person-outline'}
                size={24}
                color={i < trip.available_seats ? colors.tertiary.default : colors.text.muted}
              />
            ))}
<Text style={[styles.seatsText, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>
               {trip.available_seats} {t.trip.availableOf} {trip.total_seats} {t.trip.available}
             </Text>
          </View>
        </View>

        {trip.notes && (
          <View style={[styles.section, { paddingHorizontal: spacing.lg }]}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{t.trip.driverNotes}</Text>
            <View style={[styles.notesCard, { backgroundColor: colors.background.card, ...shadow.sm }]}>
              <Ionicons name="document-text-outline" size={20} color={colors.text.secondary} />
              <Text style={[styles.notesText, { color: colors.text.secondary, marginLeft: spacing.sm, flex: 1, fontSize: typography.sizes.sm, fontFamily: typography.family.regular, lineHeight: typography.sizes.sm * typography.lineHeight.normal }]}>{trip.notes}</Text>
            </View>
          </View>
        )}

        <View style={[styles.bookingSection, { backgroundColor: colors.background.card, borderTopColor: colors.border.default }]}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: colors.text.muted, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{t.trip.pricePerPerson}</Text>
            <Text style={[styles.priceValue, { color: colors.tertiary.default, fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>${trip.price.toLocaleString('es-CO')}</Text>
          </View>
          <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.secondary.default }]} onPress={handleBook}>
            <Ionicons name="checkmark-circle-outline" size={22} color={colors.primary.contrast} />
            <Text style={[styles.bookButtonText, { color: colors.primary.contrast, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{t.trip.bookNow}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + spacing.md : spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: { padding: spacing.xs },
  headerTitle: {},
  content: { flex: 1 },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  driverAvatar: { width: 60, height: 60, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: {},
  driverInfo: { flex: 1 },
  driverName: {},
  driverFaculty: { marginTop: 2 },
  driverStats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: spacing.sm },
  statBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm, marginRight: spacing.sm },
  statText: { marginLeft: spacing.xs },
  section: { marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.sm },
  routeCard: { borderRadius: borderRadius.lg, padding: spacing.md },
  routePoint: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  dotContainer: { alignItems: 'center', marginRight: spacing.md },
  dot: { width: 12, height: 12, borderRadius: borderRadius.full },
  dottedLine: { width: 2, height: 30, borderStyle: 'dashed' },
  routeDetails: { flex: 1 },
  routeLabel: {},
  routeName: {},
  routeSubtext: { marginTop: 2 },
  infoCard: { borderRadius: borderRadius.lg, padding: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: {},
  infoValue: {},
  infoDivider: { height: 1 },
  seatsContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: borderRadius.lg, padding: spacing.md },
  seatsText: { marginLeft: spacing.sm },
  notesCard: { flexDirection: 'row', borderRadius: borderRadius.lg, padding: spacing.md },
  notesText: {},
  bookingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  priceContainer: { flex: 1 },
  priceLabel: {},
  priceValue: {},
  bookButton: { flexDirection: 'row', alignItems: 'center', borderRadius: borderRadius.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  bookButtonText: { marginLeft: spacing.sm },
});
