import type { $DeepPartial } from '@callstack/react-theme-provider';
import type { MD3Theme } from 'react-native-paper';

type ExtraColors = {
  text: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  backdrop?: string;
};

type AppColors = MD3Theme['colors'] & ExtraColors;
type AppTheme = Omit<MD3Theme, 'colors'> & { colors: AppColors };

declare module 'react-native-paper' {
  export function useTheme<T = AppTheme>(overrides?: $DeepPartial<T>): T;
}
