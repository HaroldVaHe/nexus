import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { borderRadius, spacing, shadow, colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();

  const a = t.about;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.default} />

      <View style={[styles.header, { backgroundColor: colors.primary.default, paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, color: colors.primary.contrast }]}>{a.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoSection, { alignItems: 'center', paddingVertical: spacing.xxl }]}>
          <View style={[styles.logoCircle, { width: 80, height: 80, borderRadius: borderRadius.full, backgroundColor: 'rgba(99, 102, 241, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md }]}>
            <Ionicons name="car-outline" size={40} color={colors.secondary.default} />
          </View>
          <Text style={[styles.appName, { fontSize: typography.sizes.xxl, fontWeight: typography.weights.extrabold, color: colors.text.primary, fontFamily: typography.family.extrabold }]}>Nexus</Text>
          <Text style={[styles.appTagline, { fontSize: typography.sizes.sm, color: colors.text.muted, fontFamily: typography.family.regular, marginTop: spacing.xs }]}>{a.tagline}</Text>
          <Text style={[styles.version, { fontSize: typography.sizes.xs, color: colors.text.muted, fontFamily: typography.family.regular, marginTop: spacing.sm }]}>Version 2.4.0 (Build 892)</Text>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.text.secondary, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{t.settings.information}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, borderRadius: borderRadius.lg, overflow: 'hidden', ...shadow.sm }]}>
            <TouchableOpacity style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} activeOpacity={0.6}
              onPress={() => Linking.openURL('https://www.unisabana.edu.co')}>
              <Ionicons name="globe-outline" size={20} color={colors.secondary.default} />
              <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium, marginLeft: spacing.md }]}>{a.website}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
            </TouchableOpacity>
            <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <TouchableOpacity style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} activeOpacity={0.6}
              onPress={() => Linking.openURL('mailto:soporte@nexus.app')}>
              <Ionicons name="mail-outline" size={20} color={colors.tertiary.default} />
              <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium, marginLeft: spacing.md }]}>{a.contact}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
            </TouchableOpacity>
            <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <TouchableOpacity style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} activeOpacity={0.6}>
              <Ionicons name="star-outline" size={20} color="#F59E0B" />
              <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium, marginLeft: spacing.md }]}>{a.rate}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, color: colors.text.secondary, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{a.legal}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, borderRadius: borderRadius.lg, overflow: 'hidden', ...shadow.sm }]}>
            <TouchableOpacity style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} activeOpacity={0.6}>
              <Ionicons name="document-text-outline" size={20} color={colors.text.secondary} />
              <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium, marginLeft: spacing.md }]}>{a.terms}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
            </TouchableOpacity>
            <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <TouchableOpacity style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} activeOpacity={0.6}>
              <Ionicons name="shield-outline" size={20} color={colors.text.secondary} />
              <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium, marginLeft: spacing.md }]}>{a.privacy}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
            </TouchableOpacity>
          </View>
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
  logoSection: {},
  logoCircle: {},
  appName: {},
  appTagline: {},
  version: {},
  section: {},
  sectionTitle: {},
  card: {},
  row: {},
  rowLabel: {},
  divider: { height: 1 },
});
