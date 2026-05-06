import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

export default function SecurityScreen() {
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  const s = t.security;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.default} />

      <View style={[styles.header, { backgroundColor: colors.primary.default }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary.contrast, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{s.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{s.auth}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, ...shadow.sm, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
            <View style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.tertiary.default} />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{s.twoFactor.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{s.twoFactor.subtitle}</Text>
              </View>
              <Switch value={twoFactor} onValueChange={setTwoFactor}
                trackColor={{ false: colors.border.default, true: colors.secondary.default }} />
            </View>
            <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <View style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="finger-print-outline" size={20} color={colors.secondary.default} />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{s.biometric.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{s.biometric.subtitle}</Text>
              </View>
              <Switch value={biometric} onValueChange={setBiometric}
                trackColor={{ false: colors.border.default, true: colors.secondary.default }} />
            </View>
            <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <TouchableOpacity style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} activeOpacity={0.6}
              onPress={() => Alert.alert(s.changePassword, 'This feature is coming soon.')}>
              <Ionicons name="key-outline" size={20} color="#F59E0B" />
              <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium, marginLeft: spacing.md }]}>{s.changePassword}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{s.privacy}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, ...shadow.sm, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
            <View style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="eye-outline" size={20} color="#EC4899" />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{s.profileVisible.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{s.profileVisible.subtitle}</Text>
              </View>
              <Switch value={profileVisibility} onValueChange={setProfileVisibility}
                trackColor={{ false: colors.border.default, true: colors.secondary.default }} />
            </View>
            <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <TouchableOpacity style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} activeOpacity={0.6}
              onPress={() => Alert.alert(s.exportData, 'You can request your data export here.')}>
              <Ionicons name="download-outline" size={20} color={colors.secondary.default} />
              <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium, marginLeft: spacing.md }]}>{s.exportData}</Text>
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + spacing.sm : spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: { padding: spacing.xs },
  headerTitle: {},
  content: { flex: 1 },
  section: {},
  sectionTitle: {},
  card: {},
  row: {},
  rowContent: {},
  rowLabel: {},
  rowSub: {},
  divider: { height: 1 },
});
