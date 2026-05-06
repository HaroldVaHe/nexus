import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import TabHeader from '@/components/TabHeader';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { tripsApi } from '@/api/trips';

interface Trip {
  id: string;
  driver: {
    id: string;
    full_name: string;
    faculty?: string;
    average_rating?: number;
  };
  origin_name: string;
  destination_name: string;
  departure_time: string;
  available_seats: number;
  total_seats: number;
  price: number;
  status: string;
  notes?: string;
}

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const { token } = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('Universidad de La Sabana');
  const [results, setResults] = useState<Trip[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const s = t.search;
  const c = t.common;

  const handleSearch = async () => {
    if (!token) {
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const data = await tripsApi.searchTrips(token, {
        origin: origin.trim() || undefined,
        destination: destination.trim() || undefined,
      });
      setResults(data || []);
    } catch (error) {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <Link href={`/trip/${item.id}`} asChild>
      <TouchableOpacity style={[styles.tripCard, { backgroundColor: colors.background.card, ...shadow.md }]}>
        <View style={styles.cardHeader}>
          <View style={styles.driverInfo}>
            <View style={[styles.driverAvatar, { backgroundColor: colors.secondary.default }]}>
              <Text style={[styles.avatarText, { color: colors.primary.contrast, fontSize: typography.sizes.md, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{item.driver?.full_name?.charAt(0) || '?'}</Text>
            </View>
            <View>
              <Text style={[styles.driverName, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{item.driver?.full_name || 'Desconocido'}</Text>
              <Text style={[styles.driverFaculty, { color: colors.text.muted, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{item.driver?.faculty || '-'}</Text>
            </View>
          </View>
          <View style={[styles.ratingBadge, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: '#92400E', fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>
              {item.driver?.average_rating?.toFixed(1) || '0.0'}
            </Text>
          </View>
        </View>
        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <Ionicons name="location" size={16} color={colors.tertiary.default} />
            <Text style={[styles.routeText, { color: colors.text.primary, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]} numberOfLines={1}>{item.origin_name}</Text>
          </View>
          <View style={[styles.routeLine, { backgroundColor: colors.border.default }]} />
          <View style={styles.routePoint}>
            <Ionicons name="flag" size={16} color={colors.secondary.default} />
            <Text style={[styles.routeText, { color: colors.text.primary, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]} numberOfLines={1}>{item.destination_name}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.tripDetails}>
            <Ionicons name="time-outline" size={14} color={colors.text.muted} />
            <Text style={[styles.detailText, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{formatTime(item.departure_time)}</Text>
          </View>
          <View style={styles.tripDetails}>
            <Ionicons name="people-outline" size={14} color={colors.text.muted} />
            <Text style={[styles.detailText, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{item.available_seats} {c.seats}</Text>
          </View>
        </View>
        <View style={styles.cardBottom}>
          <Text style={[styles.priceText, { color: colors.tertiary.default, fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>${Number(item.price).toLocaleString('es-CO')}</Text>
          <TouchableOpacity style={[styles.bookButton, { backgroundColor: colors.secondary.default }]} onPress={() => router.push(`/trip/${item.id}`)}>
            <Text style={[styles.bookButtonText, { color: colors.primary.contrast, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{s.viewDetails}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <TabHeader />

      <ScrollView style={styles.content}>
        <View style={[styles.searchForm, { paddingHorizontal: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{s.title}</Text>
          <View style={[styles.inputGroup, { backgroundColor: colors.background.card, borderColor: colors.border.default }]}>
            <Ionicons name="location-outline" size={20} color={colors.tertiary.default} />
            <TextInput style={[styles.input, { color: colors.text.primary, fontSize: typography.sizes.md, fontFamily: typography.family.regular }]} placeholder={s.originPlaceholder} placeholderTextColor={colors.text.muted} value={origin} onChangeText={setOrigin} />
          </View>
          <View style={[styles.inputGroup, { backgroundColor: colors.background.card, borderColor: colors.border.default }]}>
            <Ionicons name="flag-outline" size={20} color={colors.secondary.default} />
            <TextInput style={[styles.input, { color: colors.text.primary, fontSize: typography.sizes.md, fontFamily: typography.family.regular }]} placeholder={s.destinationPlaceholder} placeholderTextColor={colors.text.muted} value={destination} onChangeText={setDestination} />
          </View>
          <TouchableOpacity style={[styles.dateButton, { backgroundColor: colors.background.card, borderColor: colors.border.default }]}>
            <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
            <Text style={[styles.dateText, { color: colors.text.primary, fontSize: typography.sizes.md, fontFamily: typography.family.regular }]}>{t.common.today}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.secondary.default }]} onPress={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <ActivityIndicator size="small" color={colors.primary.contrast} />
            ) : (
              <>
                <Ionicons name="search" size={20} color={colors.primary.contrast} />
                <Text style={[styles.searchButtonText, { color: colors.primary.contrast, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{s.findTrips}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {hasSearched && (
          <View style={[styles.resultsSection, { paddingHorizontal: spacing.lg }]}>
            {isSearching ? (
              <View style={[styles.emptyState, { alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.secondary.default} />
                <Text style={[styles.emptyText, { color: colors.text.primary, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, marginTop: spacing.md }]}>Buscando viajes...</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.resultsTitle, { color: colors.text.primary, fontWeight: typography.weights.bold, fontFamily: typography.family.bold }]}>{results.length} {s.resultsFound}</Text>
                {results.length === 0 ? (
                  <View style={[styles.emptyState, { alignItems: 'center' }]}>
                    <Ionicons name="car-sport-outline" size={64} color={colors.text.muted} />
                    <Text style={[styles.emptyText, { color: colors.text.primary, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{s.noTrips}</Text>
                    <Text style={[styles.emptySubtext, { color: colors.text.muted, fontSize: typography.sizes.sm, fontFamily: typography.family.regular }]}>{s.noTripsSub}</Text>
                  </View>
                ) : (
                  <FlatList data={results} renderItem={renderTripCard} keyExtractor={(item) => item.id} scrollEnabled={false} ItemSeparatorComponent={() => <View style={styles.separator} />} />
                )}
              </>
            )}
          </View>
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  searchForm: { paddingTop: spacing.lg },
  sectionTitle: { marginBottom: spacing.md },
  inputGroup: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md, marginBottom: spacing.sm },
  input: { flex: 1, marginLeft: spacing.sm },
  dateButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md, marginBottom: spacing.lg },
  dateText: { marginLeft: spacing.sm },
  searchButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.md, paddingVertical: spacing.md, marginBottom: spacing.lg },
  searchButtonText: { marginLeft: spacing.sm },
  resultsSection: { marginTop: spacing.lg },
  resultsTitle: { marginBottom: spacing.md },
  tripCard: { borderRadius: borderRadius.lg, padding: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  driverInfo: { flexDirection: 'row', alignItems: 'center' },
  driverAvatar: { width: 40, height: 40, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  avatarText: {},
  driverName: {},
  driverFaculty: {},
  ratingBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  ratingText: { marginLeft: spacing.xs },
  routeContainer: { marginBottom: spacing.md },
  routePoint: { flexDirection: 'row', alignItems: 'center' },
  routeText: { marginLeft: spacing.sm, flex: 1 },
  routeLine: { width: 1, height: 16, marginLeft: 8, marginVertical: spacing.xs },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  tripDetails: { flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: spacing.xs },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: {},
  bookButton: { borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  bookButtonText: { marginLeft: spacing.sm },
  separator: { height: spacing.md },
  emptyState: { paddingVertical: spacing.xxxl },
  emptyText: { marginTop: spacing.md },
  emptySubtext: { marginTop: spacing.xs },
});
