import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

export default function HeaderMenu() {
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { height: windowHeight } = Dimensions.get('window');
  const maxMenuHeight = windowHeight * 0.65;

  const menuItems = [
    { icon: 'car-outline', label: t.headerMenu.myTrips, route: '/bookings' },
    { icon: 'notifications-outline', label: t.headerMenu.notifications, route: '/notifications' },
    { icon: 'card-outline', label: t.headerMenu.paymentMethods, route: '/payments' },
    { icon: 'document-text-outline', label: t.headerMenu.reports, route: '/report' },
    { icon: 'help-circle-outline', label: t.headerMenu.helpCenter, route: '/help' },
    { icon: 'settings-outline', label: t.headerMenu.settings, route: '/settings' },
  ];

  const open = () => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const close = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const navigate = (route: string) => {
    close();
    router.push(route as any);
  };

  return (
    <>
      <TouchableOpacity onPress={open} style={[styles.menuButton, { padding: spacing.xs }]}>
        <Ionicons name="menu" size={26} color={colors.primary.contrast} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={close}>
          <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center' }]}>
            <Animated.View style={[styles.menuContainer, { opacity: fadeAnim, alignSelf: 'flex-end', marginTop: 60, marginRight: spacing.md, minWidth: 240, maxHeight: maxMenuHeight, ...shadow.lg }]}>
              <TouchableWithoutFeedback>
                <View style={[styles.menuContent, { backgroundColor: colors.background.card, borderRadius: borderRadius.lg, overflow: 'hidden' }]}>
                  <View style={[styles.menuHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.default }]}>
                    <Text style={[styles.menuTitle, { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text.primary, fontFamily: typography.family.bold }]}>{t.headerMenu.title}</Text>
                    <TouchableOpacity onPress={close}>
                      <Ionicons name="close" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xs }}>
                    {menuItems.map((item, idx) => (
                      <TouchableOpacity key={idx} style={[styles.menuItem, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: idx < menuItems.length - 1 ? 1 : 0, borderBottomColor: colors.border.default + '40' }]} onPress={() => navigate(item.route)}>
                        <Ionicons name={item.icon as any} size={22} color={colors.text.secondary} />
                        <Text style={[styles.menuItemText, { flex: 1, marginLeft: spacing.md, fontSize: typography.sizes.md, color: colors.text.primary, fontFamily: typography.family.medium }]}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  menuButton: {},
  overlay: {},
  menuContainer: {},
  menuContent: {},
  menuHeader: {},
  menuTitle: {},
  menuItem: {},
  menuItemText: {},
});
