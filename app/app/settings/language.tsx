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
} from 'react-native';
import { useRouter } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import type { Language } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function LanguageScreen() {
  const router = useRouter();
  const { language, t, setLanguage } = useSettings();
  const { colors, typography } = useTheme();

  const langOptions: { id: Language; label: string; native: string }[] = [
    { id: 'es', label: t.languageSettings.spanish, native: t.languageSettings.spanishNative },
    { id: 'en', label: t.languageSettings.english, native: t.languageSettings.englishNative },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.default} />

      <View style={[styles.header, { backgroundColor: colors.primary.default }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary.contrast, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{t.languageSettings.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, fontFamily: typography.family.semibold, textTransform: 'uppercase' }]}>{t.languageSettings.appLanguage}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, ...shadow.sm, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
            {langOptions.map((lang, index) => (
              <React.Fragment key={lang.id}>
                {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border.default, height: 1 }]} />}
                <TouchableOpacity
                  style={[styles.langRow, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}
                  activeOpacity={0.6}
                  onPress={() => setLanguage(lang.id)}
                >
                  <Ionicons
                    name={language === lang.id ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={language === lang.id ? colors.secondary.default : colors.text.muted}
                  />
                  <View style={[styles.langContent, { flex: 1, marginLeft: spacing.md }]}>
                    <Text style={[styles.langLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{lang.label}</Text>
                    <Text style={[styles.langSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{lang.native}</Text>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
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
  langRow: {},
  langContent: {},
  langLabel: {},
  langSub: {},
  divider: { height: 1 },
});
