import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import { Language, translationDict } from '@/i18n';
import type { en } from '@/i18n/translations/en';

type ThemeMode = 'system' | 'light' | 'dark';

type AppearanceSettings = {
  fontScale: number;
  highContrast: boolean;
  alwaysShowStatusBar: boolean;
  theme: ThemeMode;
};

type SettingsState = {
  language: Language;
  t: typeof en;
  appearance: AppearanceSettings;
};

type SettingsContextType = SettingsState & {
  setLanguage: (lang: Language) => void;
  setFontScale: (scale: number) => void;
  setHighContrast: (val: boolean) => void;
  setAlwaysShowStatusBar: (val: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

const KEYS = {
  language: 'nexus_language',
  fontScale: 'nexus_font_scale',
  highContrast: 'nexus_high_contrast',
  statusBar: 'nexus_status_bar',
  theme: 'nexus_theme',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    fontScale: 1,
    highContrast: false,
    alwaysShowStatusBar: true,
    theme: 'system',
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [lang, fontScale, highContrast, statusBar, theme] = await Promise.all([
          SecureStore.getItemAsync(KEYS.language),
          SecureStore.getItemAsync(KEYS.fontScale),
          SecureStore.getItemAsync(KEYS.highContrast),
          SecureStore.getItemAsync(KEYS.statusBar),
          SecureStore.getItemAsync(KEYS.theme),
        ]);
        if (lang && (lang === 'en' || lang === 'es')) {
          setLanguageState(lang);
        } else {
          const deviceLang = Localization.getLocales()[0]?.languageCode;
          if (deviceLang === 'en' || deviceLang === 'es') {
            setLanguageState(deviceLang);
          }
        }
        if (fontScale) setAppearance((prev) => ({ ...prev, fontScale: parseFloat(fontScale) }));
        if (highContrast !== null) setAppearance((prev) => ({ ...prev, highContrast: highContrast === 'true' }));
        if (statusBar !== null) setAppearance((prev) => ({ ...prev, alwaysShowStatusBar: statusBar === 'true' }));
        if (theme && (theme === 'system' || theme === 'light' || theme === 'dark')) setAppearance((prev) => ({ ...prev, theme }));
      } catch {
        // Use defaults
      }
      setLoaded(true);
    })();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await SecureStore.setItemAsync(KEYS.language, lang);
  }, []);

  const setFontScale = useCallback(async (scale: number) => {
    setAppearance((prev) => ({ ...prev, fontScale: scale }));
    await SecureStore.setItemAsync(KEYS.fontScale, String(scale));
  }, []);

  const setHighContrast = useCallback(async (val: boolean) => {
    setAppearance((prev) => ({ ...prev, highContrast: val }));
    await SecureStore.setItemAsync(KEYS.highContrast, String(val));
  }, []);

  const setAlwaysShowStatusBar = useCallback(async (val: boolean) => {
    setAppearance((prev) => ({ ...prev, alwaysShowStatusBar: val }));
    await SecureStore.setItemAsync(KEYS.statusBar, String(val));
  }, []);

  const setTheme = useCallback(async (theme: ThemeMode) => {
    setAppearance((prev) => ({ ...prev, theme }));
    await SecureStore.setItemAsync(KEYS.theme, theme);
  }, []);

  const t = translationDict[language];

  if (!loaded) return null;

  return (
    <SettingsContext.Provider
      value={{
        language,
        t,
        appearance,
        setLanguage,
        setFontScale,
        setHighContrast,
        setAlwaysShowStatusBar,
        setTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
