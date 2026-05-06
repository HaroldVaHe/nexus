import { useColorScheme, TextStyle, ViewStyle } from 'react-native';
import { useSettings } from '@/context/SettingsContext';
import { spacing as baseSpacing, borderRadius, shadow as baseShadow, typography as baseTypography } from '@/theme/colors';

const lightColors = {
  primary: { default: '#0F172A', light: '#1E293B', dark: '#020617', contrast: '#FFFFFF' },
  secondary: { default: '#6366F1', light: '#818CF8', dark: '#4F46E5', contrast: '#FFFFFF' },
  tertiary: { default: '#0D9488', light: '#14B8A6', dark: '#0F766E', contrast: '#FFFFFF' },
  neutral: { default: '#787778', light: '#D1D5DB', dark: '#6B7280', lightest: '#F3F4F6' },
  background: { default: '#F8FAFC', card: '#FFFFFF', overlay: 'rgba(15, 23, 42, 0.5)', elevated: '#FFFFFF' },
  text: { primary: '#0F172A', secondary: '#475569', muted: '#94A3B8', inverse: '#FFFFFF', link: '#6366F1', success: '#059669', error: '#DC2626' },
  border: { default: '#E2E8F0', dark: '#CBD5E1', focus: '#6366F1', error: '#FCA5A5', success: '#6EE7B7' },
  status: { error: '#DC2626', errorBg: '#FEF2F2', success: '#059669', successBg: '#ECFDF5', warning: '#D97706', warningBg: '#FFFBEB', info: '#2563EB', infoBg: '#EFF6FF' },
  microsoft: { blue: '#0078D4', hover: '#106EBE' },
  shadow: { sm: 'rgba(15, 23, 42, 0.08)', md: 'rgba(15, 23, 42, 0.12)', lg: 'rgba(15, 23, 42, 0.16)' },
};

const darkColors = {
  primary: { default: '#0F172A', light: '#1E293B', dark: '#020617', contrast: '#FFFFFF' },
  secondary: { default: '#818CF8', light: '#A5B4FC', dark: '#6366F1', contrast: '#FFFFFF' },
  tertiary: { default: '#14B8A6', light: '#2DD4BF', dark: '#0D9488', contrast: '#FFFFFF' },
  neutral: { default: '#9CA3AF', light: '#4B5563', dark: '#6B7280', lightest: '#1F2937' },
  background: { default: '#0B1120', card: '#1E293B', overlay: 'rgba(0, 0, 0, 0.7)', elevated: '#1E293B' },
  text: { primary: '#F1F5F9', secondary: '#94A3B8', muted: '#64748B', inverse: '#0F172A', link: '#818CF8', success: '#34D399', error: '#F87171' },
  border: { default: '#334155', dark: '#1E293B', focus: '#818CF8', error: '#F87171', success: '#34D399' },
  status: { error: '#F87171', errorBg: '#1C1917', success: '#34D399', successBg: '#064E3B', warning: '#FBBF24', warningBg: '#451A03', info: '#60A5FA', infoBg: '#1E3A5F' },
  microsoft: { blue: '#0078D4', hover: '#106EBE' },
  shadow: { sm: 'rgba(0, 0, 0, 0.3)', md: 'rgba(0, 0, 0, 0.4)', lg: 'rgba(0, 0, 0, 0.5)' },
};

const highContrastOverrides = {
  text: { primary: '#FFFFFF', secondary: '#E0E0E0', muted: '#B0B0B0' },
  border: { default: '#FFFFFF' },
  background: { card: '#000000', default: '#000000' },
};

const highContrastDarkOverrides = {
  text: { primary: '#FFFFFF', secondary: '#FFFFFF', muted: '#E0E0E0' },
  border: { default: '#FFFFFF' },
  background: { card: '#000000', default: '#000000' },
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function mergeColors(base: typeof lightColors, override: DeepPartial<typeof lightColors>): typeof lightColors {
  const result = { ...base };
  for (const key of Object.keys(override) as (keyof typeof lightColors)[]) {
    if (typeof override[key] === 'object' && !Array.isArray(override[key])) {
      result[key] = { ...result[key], ...override[key] } as any;
    } else if (override[key] !== undefined) {
      result[key] = override[key] as any;
    }
  }
  return result;
}

function scaleTypography(base: typeof baseTypography, scale: number) {
  const sizes = { ...base.sizes };
  for (const key of Object.keys(sizes)) {
    sizes[key as keyof typeof sizes] = Math.round(sizes[key as keyof typeof sizes] * scale);
  }
  return { ...base, sizes };
}

export function useTheme() {
  const { appearance } = useSettings();
  const systemScheme = useColorScheme();

  const isDark = appearance.theme === 'dark' || (appearance.theme === 'system' && systemScheme === 'dark');
  const base = isDark ? darkColors : lightColors;

  let colors = base;
  if (appearance.highContrast) {
    colors = mergeColors(colors, isDark ? highContrastDarkOverrides : highContrastOverrides);
  }

  const typography = scaleTypography(baseTypography, appearance.fontScale);

  return {
    colors,
    typography,
    spacing: baseSpacing,
    borderRadius,
    shadow: baseShadow,
    isDark,
    fontScale: appearance.fontScale,
    highContrast: appearance.highContrast,
  };
}
