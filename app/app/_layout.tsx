import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import * as Sentry from 'sentry-expo';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { colors } from '@/theme/colors';
import { CONFIG } from '@/utils/config';

if (CONFIG.SENTRY_DSN) {
  Sentry.init({
    dsn: CONFIG.SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    enableInExpoDevelopment: true,
    tracesSampleRate: 0.1,
  });
}

function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const content = (
    <SafeAreaProvider>
      <AuthProvider>
        <SettingsProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: colors.background.default,
              },
              animation: 'default',
            }}
          />
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );

  if (CONFIG.SENTRY_DSN) {
    return <Sentry.Native.ErrorBoundary>{content}</Sentry.Native.ErrorBoundary>;
  }

  return content;
}

export default RootLayout;
