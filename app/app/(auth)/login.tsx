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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LoginButton } from '@/components/LoginButton';
import { borderRadius, spacing, typography } from '@/theme/colors';
import { validateInstitutionalEmail } from '@/utils/config';
import { apiClient } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { showAlert } from '@/utils/alert';
import { useTheme } from '@/hooks/useTheme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useSettings();
  const { colors, typography } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = useCallback(async () => {
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: t.common.emailRequired });
      return;
    }

    if (!validateInstitutionalEmail(email)) {
      setErrors({ email: t.common.useInstitutionalEmail });
      return;
    }

    if (!password.trim()) {
      setErrors({ password: t.common.passwordRequired });
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.login(
        email.toLowerCase(),
        password
      );

      await login(response);

      router.replace('/(tabs)/home');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t.common.error;

      showAlert(t.login.loginError, message);
    } finally {
      setLoading(false);
    }
  }, [email, password, router, login]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background.default },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary.dark}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.title,
                {
                  fontSize: typography.sizes.xxxl,
                  fontWeight: typography.weights.extrabold,
                  fontFamily: typography.family.bold,
                  color: colors.primary.default,
                },
              ]}
            >
              {t.app.name}
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.weights.semibold,
                  fontFamily: typography.family.semibold,
                  color: colors.secondary.default,
                },
              ]}
            >
              {t.login.carpoolingUni}
            </Text>

            <Text
              style={[
                styles.description,
                {
                  fontSize: typography.sizes.sm,
                  textAlign: 'center',
                  lineHeight:
                    typography.sizes.md *
                    typography.lineHeight.normal,
                  paddingHorizontal: spacing.md,
                  fontFamily: typography.family.regular,
                  color: colors.text.secondary,
                },
              ]}
            >
              {t.login.connectDesc}
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text.primary,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.semibold,
                    fontFamily: typography.family.semibold,
                  },
                ]}
              >
                {t.login.institutionalEmail}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.default,
                    color: colors.text.primary,
                    fontSize: typography.sizes.md,
                    fontFamily: typography.family.regular,
                  },
                  !!errors.email && {
                    borderColor: colors.border.error,
                  },
                ]}
                placeholder={t.app.domain}
                placeholderTextColor={colors.text.muted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text.toLowerCase());

                  if (errors.email) {
                    setErrors({
                      ...errors,
                      email: '',
                    });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />

              {errors.email ? (
                <Text
                  style={[
                    styles.errorText,
                    {
                      color: colors.status.error,
                      fontSize: typography.sizes.xs,
                      fontFamily: typography.family.medium,
                    },
                  ]}
                >
                  {errors.email}
                </Text>
              ) : null}
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text.primary,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.semibold,
                    fontFamily: typography.family.semibold,
                  },
                ]}
              >
                {t.login.password}
              </Text>

              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.default,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text.primary,
                      fontSize: typography.sizes.md,
                      fontFamily: typography.family.regular,
                      paddingRight: 40,
                    },
                    !!errors.password && {
                      borderColor: colors.border.error,
                    },
                  ]}
                  placeholder={t.login.passwordPlaceholder}
                  placeholderTextColor={colors.text.muted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);

                    if (errors.password) {
                      setErrors({
                        ...errors,
                        password: '',
                      });
                    }
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <Text
                    style={[
                      styles.eyeButtonText,
                      {
                        fontSize: typography.sizes.md,
                      },
                    ]}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </Text>
                </TouchableOpacity>
              </View>

              {errors.password ? (
                <Text
                  style={[
                    styles.errorText,
                    {
                      color: colors.status.error,
                      fontSize: typography.sizes.xs,
                      fontFamily: typography.family.medium,
                    },
                  ]}
                >
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* LOGIN BUTTON */}
            <LoginButton
              title={t.login.loginButton}
              onPress={handleLogin}
              loading={loading}
              disabled={!email.trim() || !password.trim()}
              variant="primary"
              style={styles.button}
            />

            {/* DIVIDER */}
            <View style={styles.dividerContainer}>
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor:
                      colors.border.default,
                  },
                ]}
              />

              <Text
                style={[
                  styles.dividerText,
                  {
                    color: colors.text.muted,
                    fontSize: typography.sizes.sm,
                    fontFamily: typography.family.medium,
                  },
                ]}
              >
                {t.common.or}
              </Text>

              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor:
                      colors.border.default,
                  },
                ]}
              />
            </View>

            {/* MICROSOFT BUTTON */}
            <LoginButton
              title={t.login.microsoft}
              onPress={() =>
                showAlert(
                  t.login.comingSoon,
                  t.login.microsoftComingSoon
                )
              }
              loading={false}
              variant="microsoft"
              style={styles.microsoftButton}
            />

            {/* REGISTER */}
            <View style={styles.registerContainer}>
              <Text
                style={[
                  styles.registerText,
                  {
                    color: colors.text.secondary,
                    fontSize: typography.sizes.sm,
                    fontFamily: typography.family.regular,
                  },
                ]}
              >
                {t.login.noAccount}{' '}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push('/(auth)/register')
                }
              >
                <Text
                  style={[
                    styles.registerLink,
                    {
                      color: colors.secondary.default,
                      fontSize: typography.sizes.sm,
                      fontWeight:
                        typography.weights.semibold,
                      fontFamily:
                        typography.family.semibold,
                    },
                  ]}
                >
                  {t.login.registerHere}
                </Text>
              </TouchableOpacity>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text
                style={[
                  styles.footerText,
                  {
                    color: colors.text.secondary,
                    fontSize: typography.sizes.xs,
                    fontFamily: typography.family.regular,
                  },
                ]}
              >
                {t.login.footer}
              </Text>

              <View
                style={[
                  styles.domainBadge,
                  {
                    backgroundColor:
                      colors.background.card,
                    borderColor:
                      colors.border.default,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.domainBadgeText,
                    {
                      color:
                        colors.secondary.default,
                      fontSize:
                        typography.sizes.xs,
                      fontWeight:
                        typography.weights.medium,
                      fontFamily:
                        typography.family.medium,
                    },
                  ]}
                >
                  {t.app.domain}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },

  title: {
    marginBottom: spacing.xs,
  },

  subtitle: {
    marginBottom: spacing.md,
  },

  description: {
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },

  form: {
    width: '100%',
  },

  inputGroup: {
    marginBottom: spacing.md,
  },

  label: {
    marginBottom: spacing.sm,
  },

  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingRight: spacing.md,
  },

  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    padding: spacing.xs,
  },

  eyeButtonText: {
    fontSize: typography.sizes.md,
  },

  errorText: {
    marginTop: spacing.xs,
  },

  button: {
    marginTop: spacing.sm,
  },

  microsoftButton: {
    marginTop: spacing.sm,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },

  divider: {
    flex: 1,
    height: 1,
  },

  dividerText: {
    marginHorizontal: spacing.md,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  registerText: {},

  registerLink: {},

  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  footerText: {
    marginBottom: spacing.sm,
  },

  domainBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },

  domainBadgeText: {},
});