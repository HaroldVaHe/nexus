import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { borderRadius, spacing, shadow, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { notificationsApi, NotificationItem } from '@/api/notifications';
import PageHeader from '@/components/PageHeader';

function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const date = new Date(isoDate).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 30) return `Hace ${diffDays} días`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Hace ${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;

  const diffYears = Math.floor(diffMonths / 12);
  return `Hace ${diffYears} año${diffYears > 1 ? 's' : ''}`;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const unread = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const data = await notificationsApi.findAll(token);
      setNotifications(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed': return { name: 'checkmark-circle', color: colors.status.success, bg: colors.status.successBg };
      case 'booking_cancelled': return { name: 'close-circle', color: colors.status.error, bg: colors.status.errorBg };
      case 'trip_cancelled': return { name: 'warning', color: colors.status.error, bg: colors.status.errorBg };
      case 'trip_modified': return { name: 'pencil', color: colors.status.info, bg: colors.status.infoBg };
      case 'payment_received': return { name: 'card', color: colors.tertiary.default, bg: '#ECFDF5' };
      case 'rating_received': return { name: 'star', color: '#F59E0B', bg: '#FEF3C7' };
      case 'sabana_coins_earned': return { name: 'trophy', color: '#F59E0B', bg: '#FEF3C7' };
      default: return { name: 'notifications', color: colors.text.secondary, bg: colors.background.default };
    }
  };

  const getNotificationText = (type: string) => {
    switch (type) {
      case 'booking_confirmed':
        return { title: t.notifications.bookingConfirmed, message: t.notifications.bookingConfirmedMsg };
      case 'sabana_coins_earned':
        return { title: t.notifications.sabanaCoins, message: t.notifications.sabanaCoinsMsg };
      case 'rating_received':
        return { title: t.notifications.ratingReceived, message: t.notifications.ratingReceivedMsg };
      case 'payment_received':
        return { title: t.notifications.paymentReceived, message: t.notifications.paymentReceivedMsg };
      case 'trip_modified':
        return { title: t.notifications.tripModified, message: t.notifications.tripModifiedMsg };
      case 'booking_cancelled':
        return { title: t.notifications.bookingCancelled, message: t.notifications.bookingCancelledMsg };
      default:
        return { title: '', message: '' };
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      await notificationsApi.markAllAsRead(token);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch {
    }
  };

  const handleMarkAsRead = async (item: NotificationItem) => {
    if (!token || item.is_read) return;
    try {
      await notificationsApi.markAsRead(token, item.id);
      setNotifications(notifications.map(n => n.id === item.id ? { ...n, is_read: true } : n));
    } catch {
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const icon = getNotificationIcon(item.type);
    const { title, message } = getNotificationText(item.type);

    return (
      <TouchableOpacity
        style={[styles.notificationCard, { backgroundColor: colors.background.card, ...shadow.sm }, !item.is_read && { borderColor: colors.secondary.default + '30', borderWidth: 1 }]}
        onPress={() => handleMarkAsRead(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
          <Ionicons name={icon.name as any} size={20} color={icon.color} />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }, !item.is_read && { color: colors.secondary.default }]}>
              {title || item.title}
            </Text>
            {!item.is_read && <View style={[styles.unreadDot, { backgroundColor: colors.secondary.default }]} />}
          </View>
          <Text style={[styles.notificationMessage, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontFamily: typography.family.regular, lineHeight: typography.sizes.sm * typography.lineHeight.normal }]} numberOfLines={2}>
            {message || item.message}
          </Text>
          <Text style={[styles.notificationTime, { color: colors.text.muted, fontSize: typography.sizes.xs, fontFamily: typography.family.regular }]}>
            {formatRelativeTime(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <PageHeader
        title={t.notifications.title}
        rightAction={
          unread > 0 ? (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text style={[styles.markReadText, { color: colors.secondary.light, fontSize: typography.sizes.sm, fontFamily: typography.family.medium }]}>{t.notifications.markRead}</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary.default} />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.secondary.default + '15' }]}>
              <Text style={[styles.unreadBadgeText, { color: colors.secondary.default, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>
                {unread} {unread === 1 ? t.notifications.unread : t.notifications.unreadPlural}
              </Text>
            </View>
          )}

          {notifications.length === 0 && !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.text.muted} />
              <Text style={[styles.emptyText, { color: colors.text.muted, fontSize: typography.sizes.md, fontFamily: typography.family.regular }]}>
                No hay notificaciones
              </Text>
            </View>
          )}

          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  markReadText: {},
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  unreadBadge: { padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.md, alignItems: 'center' },
  unreadBadgeText: {},
  notificationCard: { flexDirection: 'row', borderRadius: borderRadius.lg, padding: spacing.md },
  iconContainer: { width: 40, height: 40, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  notificationContent: { flex: 1 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  notificationTitle: {},
  unreadDot: { width: 8, height: 8, borderRadius: borderRadius.full },
  notificationMessage: {},
  notificationTime: { marginTop: spacing.xs },
  separator: { height: spacing.sm },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyText: { marginTop: spacing.md },
});
