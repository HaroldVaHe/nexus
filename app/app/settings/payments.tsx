import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

const mockCards = [
  { id: '1', type: 'visa' as const, last4: '4242', exp: '12/27' },
  { id: '2', type: 'mastercard' as const, last4: '8888', exp: '06/26' },
];

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();

  const p = t.payments;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.default} />

      <View style={[styles.header, { backgroundColor: colors.primary.default, paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary.contrast, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{p.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{p.savedCards}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, ...shadow.sm, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
            {mockCards.map((card, index) => (
              <React.Fragment key={card.id}>
                {index > 0 && <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />}
                <TouchableOpacity style={[styles.cardRow, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} activeOpacity={0.6}
                  onPress={() => Alert.alert('Edit Card', `•••• ${card.last4} - Expires ${card.exp}`)}>
                  <View style={[styles.cardIcon, { width: 40, height: 40, borderRadius: borderRadius.full, backgroundColor: 'rgba(99, 102, 241, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }]}>
                    <Ionicons name="card-outline" size={24} color={colors.secondary.default} />
                  </View>
                  <View style={[styles.cardContent, { flex: 1, marginLeft: spacing.md }]}>
                    <Text style={[styles.cardLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{card.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {card.last4}</Text>
                    <Text style={[styles.cardSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>Exp: {card.exp}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <TouchableOpacity style={[styles.addButton, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary.default, borderRadius: borderRadius.lg, paddingVertical: spacing.md, ...shadow.sm, gap: spacing.sm }]}
            activeOpacity={0.8}
            onPress={() => Alert.alert(p.addCard, 'This feature is coming soon.')}>
            <Ionicons name="add-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.addButtonText, { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: '#FFFFFF', fontFamily: typography.family.semibold }]}>{p.addCard}</Text>
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
    paddingBottom: spacing.md,
  },
  backButton: { padding: spacing.xs },
  headerTitle: {},
  content: { flex: 1 },
  section: {},
  sectionTitle: {},
  card: {},
  cardRow: {},
  cardIcon: {},
  cardContent: {},
  cardLabel: {},
  cardSub: {},
  divider: { height: 1 },
  addButton: {},
  addButtonText: {},
});
