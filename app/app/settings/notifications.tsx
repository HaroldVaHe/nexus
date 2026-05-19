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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [tripAlerts, setTripAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const n = t.notificationsSettings;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.default} />

      <View style={[styles.header, { backgroundColor: colors.primary.default, paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary.contrast, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{t.notifications.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{n.channel}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, ...shadow.sm, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
            <View style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.secondary.default} />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{n.push.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{n.push.subtitle}</Text>
              </View>
              <Switch value={pushNotifications} onValueChange={setPushNotifications}
                trackColor={{ false: colors.border.default, true: colors.secondary.default }} />
            </View>
            <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <View style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="mail-outline" size={20} color={colors.tertiary.default} />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{n.email.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{n.email.subtitle}</Text>
              </View>
              <Switch value={emailNotifications} onValueChange={setEmailNotifications}
                trackColor={{ false: colors.border.default, true: colors.secondary.default }} />
            </View>
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' }]}>{t.settings.preferences}</Text>
          <View style={[styles.card, { backgroundColor: colors.background.card, ...shadow.sm, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
            <View style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="car-outline" size={20} color="#F59E0B" />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{n.tripAlerts.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{n.tripAlerts.subtitle}</Text>
              </View>
              <Switch value={tripAlerts} onValueChange={setTripAlerts}
                trackColor={{ false: colors.border.default, true: colors.secondary.default }} />
            </View>
            <View style={[styles.divider, { height: 1, backgroundColor: colors.border.default, marginHorizontal: spacing.md }]} />
            <View style={[styles.row, { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md }]}>
              <Ionicons name="volume-high-outline" size={20} color="#EC4899" />
              <View style={[styles.rowContent, { flex: 1, marginLeft: spacing.md }]}>
                <Text style={[styles.rowLabel, { fontSize: typography.sizes.md, fontWeight: typography.weights.medium, color: colors.text.primary, fontFamily: typography.family.medium }]}>{n.sound.title}</Text>
                <Text style={[styles.rowSub, { fontSize: typography.sizes.sm, marginTop: 2, color: colors.text.muted, fontFamily: typography.family.regular }]}>{n.sound.subtitle}</Text>
              </View>
              <Switch value={soundEnabled} onValueChange={setSoundEnabled}
                trackColor={{ false: colors.border.default, true: colors.secondary.default }} />
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
    paddingHorizontal: spacing.md,
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
