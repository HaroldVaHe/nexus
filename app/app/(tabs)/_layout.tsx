import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { t } = useSettings();
  const { colors, typography, spacing } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const roles = user?.roles || [];
  const isPassenger = roles.includes('passenger');
  const isDriver = roles.includes('driver');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary.default,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopColor: colors.border.default,
          borderTopWidth: 1,
          paddingTop: spacing.xs,
          paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, spacing.sm) : spacing.sm,
          height: Platform.OS === 'android' ? 60 + Math.max(insets.bottom, spacing.sm) : 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontFamily: typography.family.medium,
          fontSize: typography.sizes.xs,
        },
        headerStyle: {
          backgroundColor: colors.primary.default,
        },
        headerTintColor: colors.primary.contrast,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t.tabs.search,
          href: isPassenger ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: t.tabs.publish,
          href: isDriver ? undefined : null,
          tabBarIcon: ({ size }) => (
            <Ionicons name="add-circle" size={size + 8} color={colors.tertiary.default} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
