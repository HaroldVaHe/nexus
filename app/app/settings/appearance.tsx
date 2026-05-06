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
  useColorScheme,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { borderRadius, spacing, shadow } from '@/theme/colors';

export default function AppearanceScreen() {
  const router = useRouter();
  const { t, appearance, setFontScale, setHighContrast, setAlwaysShowStatusBar, setTheme } = useSettings();
  const { colors, typography } = useTheme();
  const systemScheme = useColorScheme();

  const isDark = appearance.theme === 'dark' || (appearance.theme === 'system' && systemScheme === 'dark');

  const previewBg = appearance.theme === 'dark' ? '#0B1120' : '#F8FAFC';
  const previewCard = appearance.theme === 'dark' ? '#1E293B' : '#FFFFFF';
  const cardBorder = isDark ? '#334155' : 'transparent';
  const textMuted = isDark ? '#64748B' : colors.text.muted;
  const divider = isDark ? '#334155' : colors.border.default;
  const switchTrackFalse = isDark ? '#475569' : colors.border.default;

  const ap = t.appearance;

  const themeOptions = [
    { id: 'system', label: ap.followSystem, desc: ap.followSystemDesc, previewBg: systemScheme === 'dark' ? '#0B1120' : '#F8FAFC', previewCard: systemScheme === 'dark' ? '#1E293B' : '#FFFFFF' },
    { id: 'light', label: ap.light, desc: ap.lightDesc, previewBg: '#F8FAFC', previewCard: '#FFFFFF' },
    { id: 'dark', label: ap.dark, desc: ap.darkDesc, previewBg: '#0B1120', previewCard: '#1E293B' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary.default} />

      <View style={[styles.header, { backgroundColor: colors.primary.default }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary.contrast, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{ap.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{ap.theme}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, borderColor: cardBorder, borderWidth: isDark ? 1 : 0, ...shadow.sm, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
            {themeOptions.map((option, index) => (
              <React.Fragment key={option.id}>
                {index > 0 && <View style={[styles.divider, { backgroundColor: divider, height: 1 }]} />}
                <TouchableOpacity style={[styles.optionRow, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]} onPress={() => setTheme(option.id as 'system' | 'light' | 'dark')} activeOpacity={0.6}>
                  <View style={[styles.previewCircle, { width: 40, height: 40, borderRadius: 9999, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md }]}>
                    <View style={[styles.previewInner, { width: 20, height: 20, borderRadius: 4, backgroundColor: option.previewCard }]} />
                  </View>
                  <View style={[styles.optionContent, { flex: 1 }]}>
                    <Text style={[styles.optionLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{option.label}</Text>
                    <Text style={[styles.optionSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{option.desc}</Text>
                  </View>
                  <View style={[styles.radioOuter, { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: appearance.theme === option.id ? colors.secondary.default : colors.text.muted, justifyContent: 'center', alignItems: 'center' }]}>
                    {appearance.theme === option.id && <View style={[styles.radioInner, { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.secondary.default }]} />}
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{ap.displayOptions}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, borderColor: cardBorder, borderWidth: isDark ? 1 : 0, ...shadow.sm, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
            <View style={[styles.settingRow, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="eye-outline" size={20} color={colors.tertiary.default} />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{ap.statusBar.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{ap.statusBar.subtitle}</Text>
              </View>
              <Switch
                value={appearance.alwaysShowStatusBar}
                onValueChange={setAlwaysShowStatusBar}
                trackColor={{ false: switchTrackFalse, true: colors.secondary.default }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: divider, height: 1 }]} />

            <View style={[styles.settingRow, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="text-outline" size={20} color="#8B5CF6" />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{ap.largeText.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{ap.largeText.subtitle}</Text>
              </View>
              <Switch
                value={appearance.fontScale > 1}
                onValueChange={(val) => setFontScale(val ? 1.15 : 1)}
                trackColor={{ false: switchTrackFalse, true: colors.secondary.default }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: divider, height: 1 }]} />

            <View style={[styles.settingRow, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="contrast-outline" size={20} color="#EC4899" />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{ap.highContrast.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{ap.highContrast.subtitle}</Text>
              </View>
              <Switch
                value={appearance.highContrast}
                onValueChange={setHighContrast}
                trackColor={{ false: switchTrackFalse, true: colors.secondary.default }}
              />
            </View>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 16,
    paddingBottom: 16,
  },
  backButton: { padding: 4 },
  headerTitle: { color: '#FFFFFF' },
  content: { flex: 1 },
  section: {},
  sectionTitle: {},
  card: {},
  optionRow: {},
  previewCircle: {},
  previewInner: {},
  optionContent: {},
  optionLabel: {},
  optionSub: {},
  radioOuter: {},
  radioInner: {},
  divider: {},
  settingRow: {},
  rowContent: {},
  rowLabel: {},
  rowSub: {},
});
