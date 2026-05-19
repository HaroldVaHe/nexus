import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LoginButton } from '@/components/LoginButton';
import { borderRadius, spacing, colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { validateInstitutionalEmail } from '@/utils/config';
import { apiClient } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { showAlert } from '@/utils/alert';
import { useTheme } from '@/hooks/useTheme';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [faculty, setFaculty] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedRoles, setSelectedRoles] = useState<('driver' | 'passenger')[]>(['passenger']);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = t.register.nameRequired;
    }

    if (!email.trim()) {
      newErrors.email = t.common.emailRequired;
    } else if (!validateInstitutionalEmail(email)) {
      newErrors.email = t.common.useInstitutionalEmail;
    }

    if (!password) {
      newErrors.password = t.common.passwordRequired;
    } else if (password.length < 8) {
      newErrors.password = t.register.minChars;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t.register.passwordsDontMatch;
    }

    if (selectedRoles.length === 0) {
      newErrors.roles = t.register.selectRole;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = useCallback(async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await apiClient.register({
        email: email.toLowerCase(),
        password,
        full_name: fullName,
        faculty: faculty || undefined,
        phone: phone || undefined,
        roles: selectedRoles,
      });

      await login(response);
      showAlert(
        t.register.successTitle,
        t.register.successMessage,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/home') }]
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t.register.error;
      showAlert(t.common.error, message.includes('already exists') ? t.register.emailExists : message);
    } finally {
      setLoading(false);
    }
  }, [fullName, email, phone, faculty, password, confirmPassword, selectedRoles, router, login]);

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    options: {
      placeholder: string;
      keyboardType?: 'email-address' | 'phone-pad' | 'default';
      secureTextEntry?: boolean;
      showPasswordToggle?: boolean;
      showPassword?: boolean;
      onTogglePassword?: () => void;
      icon: string;
    },
    error?: string,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text.primary, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: colors.background.card, borderColor: colors.border.default }]}>
        <Text style={[styles.inputIcon, { fontSize: typography.sizes.md }]}>{options.icon}</Text>
        <View style={styles.textInputContainer}>
            <TextInput
              style={[styles.input, { color: colors.text.primary, fontSize: typography.sizes.md, fontFamily: typography.family.regular }, !!error && { borderColor: colors.border.error }]}
            placeholder={options.placeholder}
            placeholderTextColor={colors.text.muted}
            value={value}
            onChangeText={onChangeText}
            keyboardType={options.keyboardType || 'default'}
            secureTextEntry={options.secureTextEntry}
            autoCapitalize={options.keyboardType === 'email-address' ? 'none' : 'words'}
            editable={!loading}
          />
          {options.showPasswordToggle && options.onTogglePassword && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={options.onTogglePassword}
            >
              <Text style={[styles.eyeButtonText, { fontSize: typography.sizes.md }]}>
                {options.showPassword ? '🙈' : '👁'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
       {error ? <Text style={[styles.errorText, { color: colors.status.error, fontSize: typography.sizes.xs, fontFamily: typography.family.medium }]}>{error}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.dark} />
      <View style={[styles.header, { backgroundColor: colors.primary.default, paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary.contrast, fontSize: typography.sizes.xl }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primary.contrast, fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{t.register.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.form, { paddingHorizontal: spacing.lg }]}>
            {renderInput(t.register.fullName, fullName, setFullName, {
              placeholder: t.register.fullNamePlaceholder,
              icon: '👤',
            }, errors.fullName)}

            {renderInput(t.register.institutionalEmail, email, setEmail, {
              placeholder: t.app.domain,
              keyboardType: 'email-address',
              icon: '📧',
            }, errors.email)}

            {renderInput(t.register.phone, phone, setPhone, {
              placeholder: t.register.phonePlaceholder,
              keyboardType: 'phone-pad',
              icon: '📱',
            }, errors.phone)}

            {renderInput(t.register.faculty, faculty, setFaculty, {
              placeholder: t.register.facultyPlaceholder,
              icon: '🏛',
            }, errors.faculty)}

            <View style={styles.inputGroup}>
               <Text style={[styles.label, { color: colors.text.primary, fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>{t.register.howToUse}</Text>
              <Text style={[styles.roleSubtext, { color: colors.text.muted, fontSize: typography.sizes.xs, fontFamily: typography.family.regular }]}>{t.register.roleSubtext}</Text>
              <View style={[styles.roleContainer, { gap: spacing.sm }]}>
                <TouchableOpacity
                  style={[styles.roleChip, { borderColor: colors.border.default, backgroundColor: colors.background.card },
                    selectedRoles.includes('passenger') && { backgroundColor: colors.secondary.default, borderColor: colors.secondary.default }]}
                  onPress={() => {
                    if (selectedRoles.includes('passenger')) {
                      setSelectedRoles(selectedRoles.filter(r => r !== 'passenger'));
                    } else {
                      setSelectedRoles([...selectedRoles, 'passenger']);
                    }
                  }}
                >
                  <Ionicons
                    name="person"
                    size={18}
                    color={selectedRoles.includes('passenger') ? colors.primary.contrast : colors.text.secondary}
                  />
                  <Text style={[styles.roleText, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, fontFamily: typography.family.medium },
                    selectedRoles.includes('passenger') && { color: colors.primary.contrast, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>
                    {t.register.passenger}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleChip, { borderColor: colors.border.default, backgroundColor: colors.background.card },
                    selectedRoles.includes('driver') && { backgroundColor: colors.secondary.default, borderColor: colors.secondary.default }]}
                  onPress={() => {
                    if (selectedRoles.includes('driver')) {
                      setSelectedRoles(selectedRoles.filter(r => r !== 'driver'));
                    } else {
                      setSelectedRoles([...selectedRoles, 'driver']);
                    }
                  }}
                >
                  <Ionicons
                    name="car-sport"
                    size={18}
                    color={selectedRoles.includes('driver') ? colors.primary.contrast : colors.text.secondary}
                  />
                  <Text style={[styles.roleText, { color: colors.text.secondary, fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, fontFamily: typography.family.medium },
                    selectedRoles.includes('driver') && { color: colors.primary.contrast, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }]}>
                    {t.register.driver}
                  </Text>
                </TouchableOpacity>
              </View>
               {errors.roles ? <Text style={[styles.errorText, { color: colors.status.error, fontSize: typography.sizes.xs, fontFamily: typography.family.medium }]}>{errors.roles}</Text> : null}
            </View>

            {renderInput(t.register.password, password, setPassword, {
              placeholder: t.register.passwordPlaceholder,
              secureTextEntry: !showPassword,
              showPasswordToggle: true,
              showPassword,
              onTogglePassword: () => setShowPassword(!showPassword),
              icon: '🔒',
            }, errors.password)}

            {renderInput(
              t.register.confirmPassword,
              confirmPassword,
              setConfirmPassword,
              {
                placeholder: t.register.confirmPasswordPlaceholder,
                secureTextEntry: !showConfirmPassword,
                showPasswordToggle: true,
                showPassword: showConfirmPassword,
                onTogglePassword: () => setShowConfirmPassword(!showConfirmPassword),
                icon: '🔒',
              },
              errors.confirmPassword
            )}

            <View style={styles.termsContainer}>
              <Text style={[styles.termsIcon, { fontSize: typography.sizes.md }]}>ℹ️</Text>
               <Text style={[styles.termsText, { color: colors.text.muted, fontSize: typography.sizes.xs, fontFamily: typography.family.regular }]}>
                 {t.register.terms}
               </Text>
            </View>

            <LoginButton
              title={t.register.createAccount}
              onPress={handleRegister}
              loading={loading}
              variant="primary"
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButtonText: { color: colors.primary.contrast },
  headerTitle: {},
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  form: { width: '100%' },
  inputGroup: { marginBottom: spacing.md },
  label: { marginBottom: spacing.sm },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  inputIcon: { marginRight: spacing.sm },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingRight: spacing.xl,
  },
  inputError: { borderColor: '#FCA5A5' },
  eyeButton: {
    position: 'absolute',
    right: spacing.sm,
    padding: spacing.xs,
  },
  eyeButtonText: {},
  errorText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  roleSubtext: { marginBottom: spacing.sm },
  roleContainer: { flexDirection: 'row' },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  roleText: {},
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  termsIcon: { marginRight: spacing.sm },
  termsText: { flex: 1 },
  button: { marginTop: spacing.sm },
});
