import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { spacing, borderRadius } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { testSentryMessage, testSentryError, testSentryCrash } from '@/utils/sentry-test';

type TestBtn = { label: string; action: () => void; icon: keyof typeof Ionicons.glyphMap; color: string };

const BTNS: TestBtn[] = [
  { label: 'Enviar mensaje info',    action: testSentryMessage, icon: 'chatbox-ellipses', color: '#2ecc71' },
  { label: 'Enviar error controlado', action: testSentryError,  icon: 'warning',           color: '#f39c12' },
  { label: 'Crashear app',            action: testSentryCrash,   icon: 'flash',             color: '#e74c3c' },
];

export default function SentryTestScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, typography } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.default} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.md, backgroundColor: colors.primary.default }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primary.contrast, fontFamily: typography.family.bold }]}>
          Sentry Test
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.text.muted, fontFamily: typography.family.regular }]}>
          Envía eventos de prueba a Sentry para verificar que funciona.
        </Text>

        {BTNS.map(btn => (
          <TouchableOpacity
            key={btn.label}
            style={[styles.btn, { backgroundColor: btn.color }]}
            onPress={btn.action}
            activeOpacity={0.7}
          >
            <Ionicons name={btn.icon} size={22} color="#fff" />
            <Text style={styles.btnText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}

        <View style={[styles.hint, { backgroundColor: colors.background.card, borderColor: colors.border.default }]}>
          <Ionicons name="information-circle" size={18} color={colors.text.muted} />
          <Text style={[styles.hintText, { color: colors.text.muted, fontFamily: typography.family.regular }]}>
            Después de cada prueba, revisa sentry.io &gt; Issues. El crash reinicia la app automáticamente.
          </Text>
        </View>
      </View>
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
  back: { padding: spacing.xs },
  title: { fontSize: 18 },
  content: { flex: 1, padding: spacing.md, gap: spacing.md },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: spacing.sm },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  btnText: { color: '#fff', fontSize: 15, fontFamily: 'Manrope_600SemiBold' },
  hint: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.md,
  },
  hintText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
