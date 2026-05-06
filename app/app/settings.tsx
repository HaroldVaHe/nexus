import React, { useCallback } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

type SettingItem = {
  id: string;
  title: string;
  subtitle?: string;
  value?: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  iconColor?: string;
};

function SettingsItem({
  item,
  theme,
  onPress,
}: {
  item: SettingItem;
  theme: ReturnType<typeof useTheme>;
  onPress: (route: string) => void;
}) {
  const { colors, typography } = theme;
  return (
    <TouchableOpacity style={styles.itemRow} onPress={() => onPress(item.route)} activeOpacity={0.6}>
      <View style={[styles.iconCircle, { backgroundColor: colors.neutral.lightest }]}>
        <Ionicons name={item.icon} size={20} color={item.iconColor ?? colors.secondary.default} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.medium, fontFamily: typography.family.medium }]}>{item.title}</Text>
        {item.subtitle && (
          <Text style={[styles.itemSubtitle, { color: colors.text.muted, fontSize: typography.sizes.sm, fontWeight: typography.weights.regular, fontFamily: typography.family.regular }]} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
        {item.value && !item.subtitle && (
          <Text style={[styles.itemValue, { color: colors.text.muted, fontSize: typography.sizes.sm, fontWeight: typography.weights.regular, fontFamily: typography.family.regular }]} numberOfLines={1}>
            {item.value}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
    </TouchableOpacity>
  );
}

function SettingsSection({
  title,
  items,
  theme,
  onItemPress,
}: {
  title: string;
  items: SettingItem[];
  theme: ReturnType<typeof useTheme>;
  onItemPress: (route: string) => void;
}) {
  const { colors, typography } = theme;
  return (
    <View style={[styles.section, { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }]}>
      <Text style={[styles.sectionTitle, { color: colors.text.secondary, fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, letterSpacing: 0.5, textTransform: 'uppercase' }]}>{title}</Text>
      <View style={[styles.card, { backgroundColor: colors.background.card, borderColor: theme.isDark ? colors.border.default : 'transparent', borderWidth: theme.isDark ? 1 : 0, ...theme.shadow.sm }]}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border.default }]} />}
            <SettingsItem item={item} theme={theme} onPress={onItemPress} />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useSettings();
  const theme = useTheme();
  const { colors, typography } = theme;

  const s = t.settings;

  const items: { title: string; key: string; items: SettingItem[] }[] = [
    {
      title: s.preferences,
      key: 'preferences',
      items: [
        { id: 'notifications', title: s.notifications.title, subtitle: s.notifications.subtitle, icon: 'notifications-outline', route: '/settings/notifications', iconColor: colors.secondary.default },
        { id: 'privacy', title: s.privacy.title, subtitle: s.privacy.subtitle, icon: 'shield-checkmark-outline', route: '/settings/security', iconColor: colors.tertiary.default },
        { id: 'payments', title: s.payments.title, subtitle: s.payments.subtitle, icon: 'card-outline', route: '/settings/payments', iconColor: '#F59E0B' },
      ],
    },
    {
      title: s.personalization,
      key: 'personalization',
      items: [
        { id: 'appearance', title: s.appearance.title, subtitle: s.appearance.subtitle, icon: 'color-palette-outline', route: '/settings/appearance', iconColor: '#EC4899' },
        { id: 'language', title: s.language.title, value: s.language.value, icon: 'globe-outline', route: '/settings/language', iconColor: '#3B82F6' },
      ],
    },
    {
      title: s.information,
      key: 'information',
      items: [
        { id: 'about', title: s.about.title, subtitle: s.about.subtitle, icon: 'information-circle-outline', route: '/settings/about', iconColor: colors.secondary.default },
      ],
    },
  ];

  const handleItemPress = useCallback((route: string) => { router.push(route); }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary.default} />
      <View style={[styles.header, { backgroundColor: colors.primary.default }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{s.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {items.map((section) => (
          <SettingsSection key={section.key} title={section.title} items={section.items} theme={theme} onItemPress={handleItemPress} />
        ))}
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 32 : 16, paddingBottom: 16 },
  backButton: { padding: 4 },
  headerTitle: { color: '#FFFFFF' },
  content: { flex: 1 },
  section: {},
  sectionTitle: { marginBottom: 8 },
  card: { borderRadius: 16, overflow: 'hidden' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  itemContent: { flex: 1, marginLeft: 16 },
  itemTitle: {},
  itemSubtitle: { marginTop: 2 },
  itemValue: { marginTop: 2 },
  divider: { height: 1, marginHorizontal: 16 },
});
