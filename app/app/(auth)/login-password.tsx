import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LoginButton } from '@/components/LoginButton';
import { borderRadius, spacing } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';

export default function LoginPasswordScreen() {
  const router = useRouter();
  const { t } = useSettings();
  const { colors, typography } = useTheme();
  const params = useLocalSearchParams();
  const email = (params.email as string) || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = useCallback(async () => {
    setPasswordError('');

    if (!password.trim()) {
      setPasswordError(t.common.passwordRequired);
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.replace('/(tabs)/home');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t.login.loginError;
      Alert.alert(t.common.error, message);
    } finally {
      setLoading(false);
    }
  }, [password, router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.dark} />
      <View style={[styles.header, { backgroundColor: colors.primary.default }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.primary.contrast} />
        </TouchableOpacity>
        <Text style={[{ fontSize: typography.sizes.lg, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }, { color: colors.primary.contrast }]}>{t.login.title}</Text>
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
          <View style={[styles.emailDisplay, { backgroundColor: colors.background.card, borderColor: colors.border.default }]}>
            <Ionicons name="mail-outline" size={20} color={colors.secondary.default} />
            <Text style={[{ fontSize: typography.sizes.md, fontFamily: typography.family.regular }, { color: colors.text.primary }]}>{email || 'correo@unisabana.edu.co'}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold, fontFamily: typography.family.semibold }, { color: colors.text.primary }]}>{t.login.password}</Text>
            <View style={[styles.passwordContainer, { backgroundColor: colors.background.card, borderColor: colors.border.default }]}>
              <TextInput
                style={[{ fontSize: typography.sizes.md, fontFamily: typography.family.regular }, { color: colors.text.primary }, !!passwordError && { borderColor: colors.border.error }]}
                placeholder={t.login.passwordPlaceholder}
                placeholderTextColor={colors.text.muted}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={colors.text.muted}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={[{ fontSize: typography.sizes.xs, fontFamily: typography.family.medium }, styles.errorText, { color: colors.status.error }]}>{passwordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[{ fontSize: typography.sizes.sm, fontWeight: typography.weights.medium, fontFamily: typography.family.medium }, styles.forgotPasswordText, { color: colors.secondary.default }]}>{t.login.forgotPassword}</Text>
          </TouchableOpacity>

          <LoginButton
            title={t.login.loginButton}
            onPress={handleLogin}
            loading={loading}
            disabled={!password.trim()}
            variant="primary"
            style={styles.button}
          />
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
    paddingVertical: spacing.md,
  },
  backButton: { padding: spacing.xs },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  emailDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  emailText: {
    marginLeft: spacing.sm,
  },
  inputGroup: { marginBottom: spacing.md },
  label: {
    marginBottom: spacing.sm,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingRight: spacing.xl + spacing.md,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
  errorText: {
    marginTop: spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {},
  button: { marginTop: spacing.sm },
});
