import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { borderRadius, spacing, shadow } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

const REPORT_REASONS = [
  { id: 'safety', labelKey: 'reasonSafety', icon: 'warning', descKey: 'descSafety' },
  { id: 'harassment', labelKey: 'reasonHarassment', icon: 'hand-left', descKey: 'descHarassment' },
  { id: 'no_show', labelKey: 'reasonNoShow', icon: 'close-circle', descKey: 'descNoShow' },
  { id: 'misrepresentation', labelKey: 'reasonMisrepresentation', icon: 'information-circle', descKey: 'descMisrepresentation' },
  { id: 'payment', labelKey: 'reasonPayment', icon: 'card', descKey: 'descPayment' },
  { id: 'other', labelKey: 'reasonOther', icon: 'ellipsis-horizontal', descKey: 'descOther' },
];

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const a = t.report;
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    if (!selectedReason) {
      Alert.alert(t.common.error, a.selectReason);
      return;
    }

    Alert.alert(
      a.reportSent,
      a.reportReceived,
      [
        { text: t.common.ok, onPress: () => router.replace('/(tabs)/home') },
      ]
    );
  };

  const getSeverityConfig = (level: string) => {
    const config = {
      low: { label: a.severityLow, color: colors.status.info, bg: colors.status.infoBg },
      medium: { label: a.severityMedium, color: colors.status.warning, bg: colors.status.warningBg },
      high: { label: a.severityHigh, color: colors.status.error, bg: colors.status.errorBg },
    };
    return config[level as keyof typeof config];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.default} />

      <View style={[styles.header, { backgroundColor: colors.primary.default, paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary.contrast, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{a.reportUser}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.warningCard, { backgroundColor: colors.status.warningBg, marginHorizontal: spacing.lg, marginTop: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.md }]}>
          <Ionicons name="alert-circle" size={24} color={colors.status.warning} />
          <Text style={[styles.warningText, { color: '#92400E', marginLeft: spacing.sm, flex: 1, fontSize: typography.sizes.sm, fontFamily: typography.family.regular, lineHeight: typography.sizes.sm * typography.lineHeight.normal }]}>
            {a.warningText}
          </Text>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.bold, fontFamily: typography.family.bold, marginBottom: spacing.sm }]}>{a.reason}</Text>
          {REPORT_REASONS.map(reason => (
            <TouchableOpacity
              key={reason.id}
              style={[
                styles.reasonCard,
                { backgroundColor: colors.background.card, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border.default },
                selectedReason === reason.id && { borderColor: colors.secondary.default, backgroundColor: colors.secondary.default + '08' },
              ]}
              onPress={() => setSelectedReason(reason.id)}
            >
              <View style={[
                styles.reasonIcon,
                { width: 40, height: 40, borderRadius: borderRadius.md, backgroundColor: colors.background.default, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
                selectedReason === reason.id && { backgroundColor: colors.secondary.default },
              ]}>
                <Ionicons
                  name={reason.icon as any}
                  size={20}
                  color={selectedReason === reason.id ? colors.primary.contrast : colors.text.secondary}
                />
              </View>
              <View style={[styles.reasonInfo, { flex: 1 }]}>
                <Text style={[
                  styles.reasonLabel,
                  { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, color: colors.text.primary },
                  selectedReason === reason.id && { color: colors.secondary.default },
                ]}>{a[reason.labelKey]}</Text>
                <Text style={[styles.reasonDesc, { fontSize: typography.sizes.sm, color: colors.text.muted, fontFamily: typography.family.regular }]}>{a[reason.descKey]}</Text>
              </View>
              {selectedReason === reason.id && (
                <Ionicons name="checkmark-circle" size={24} color={colors.secondary.default} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.bold, fontFamily: typography.family.bold, marginBottom: spacing.sm }]}>{a.severity}</Text>
          <View style={[styles.severityContainer, { flexDirection: 'row', gap: spacing.sm }]}>
            {(['low', 'medium', 'high'] as const).map(level => {
              const cfg = getSeverityConfig(level);
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.severityBtn,
                    { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border.default, alignItems: 'center' },
                    severity === level && { borderWidth: 2, borderColor: colors.secondary.default, backgroundColor: cfg.bg },
                  ]}
                  onPress={() => setSeverity(level)}
                >
                  <Text style={[
                    styles.severityText,
                    { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold, color: colors.text.secondary },
                    severity === level && { color: cfg.color },
                  ]}>{cfg.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, fontSize: typography.sizes.md, fontWeight: typography.weights.bold, fontFamily: typography.family.bold, marginBottom: spacing.sm }]}>{a.incidentDescription}</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.background.card, borderWidth: 1, borderColor: colors.border.default, borderRadius: borderRadius.lg, padding: spacing.md, fontSize: typography.sizes.md, color: colors.text.primary, fontFamily: typography.family.regular, minHeight: 140 }]}
            placeholder={a.detailsPlaceholder}
            placeholderTextColor={colors.text.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            numberOfLines={6}
          />
          <Text style={[styles.charCount, { fontSize: typography.sizes.xs, color: colors.text.muted, textAlign: 'right', marginTop: spacing.xs, fontFamily: typography.family.regular }]}>{description.length}/500 {a.charCount}</Text>
        </View>

        <TouchableOpacity style={[styles.submitButton, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.status.error, borderRadius: borderRadius.md, paddingVertical: spacing.md, marginHorizontal: spacing.lg, ...shadow.md }]} onPress={handleSubmit}>
          <Ionicons name="send-outline" size={20} color={colors.primary.contrast} />
          <Text style={[styles.submitButtonText, { fontSize: typography.sizes.md, fontWeight: typography.weights.semibold, color: colors.primary.contrast, marginLeft: spacing.sm, fontFamily: typography.family.semibold }]}>{a.submit}</Text>
        </TouchableOpacity>
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
  warningCard: { flexDirection: 'row', alignItems: 'flex-start' },
  warningText: {},
  section: {},
  sectionTitle: {},
  reasonCard: {},
  reasonIcon: {},
  reasonInfo: {},
  reasonLabel: {},
  reasonDesc: {},
  severityContainer: {},
  severityBtn: {},
  severityBtnSelected: {},
  severityText: {},
  textArea: {},
  charCount: {},
  submitButton: { ...shadow.md },
  submitButtonText: {},
});
