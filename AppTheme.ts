import {
  adaptNavigationTheme,
  MD3LightTheme,
  useTheme,
} from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';

/** @note created by https://callstack.github.io/react-native-paper/docs/guides/theming/#creating-dynamic-theme-colors */
const colors = {
  primary: 'rgb(104, 71, 192)',
  onPrimary: 'rgb(255, 255, 255)',
  primaryContainer: 'rgb(232, 221, 255)',
  onPrimaryContainer: 'rgb(33, 0, 93)',
  secondary: 'rgb(97, 91, 113)',
  onSecondary: 'rgb(255, 255, 255)',
  secondaryContainer: 'rgb(232, 222, 248)',
  onSecondaryContainer: 'rgb(29, 25, 43)',
  tertiary: 'rgb(125, 82, 96)',
  onTertiary: 'rgb(255, 255, 255)',
  tertiaryContainer: 'rgb(255, 217, 227)',
  onTertiaryContainer: 'rgb(49, 16, 29)',
  error: 'rgb(186, 26, 26)',
  onError: 'rgb(255, 255, 255)',
  errorContainer: 'rgb(255, 218, 214)',
  onErrorContainer: 'rgb(65, 0, 2)',
  background: 'rgb(255, 251, 255)',
  onBackground: 'rgb(28, 27, 30)',
  surface: 'rgb(255, 251, 255)',
  onSurface: 'rgb(28, 27, 30)',
  surfaceVariant: 'rgb(230, 224, 236)',
  onSurfaceVariant: 'rgb(72, 69, 78)',
  outline: 'rgb(121, 117, 127)',
  outlineVariant: 'rgb(202, 196, 207)',
  shadow: 'rgb(0, 0, 0)',
  scrim: 'rgb(0, 0, 0)',
  inverseSurface: 'rgb(49, 48, 51)',
  inverseOnSurface: 'rgb(244, 239, 244)',
  inversePrimary: 'rgb(206, 189, 255)',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(247, 242, 252)',
    level2: 'rgb(243, 237, 250)',
    level3: 'rgb(238, 231, 248)',
    level4: 'rgb(237, 229, 247)',
    level5: 'rgb(234, 226, 246)',
  },
  surfaceDisabled: 'rgba(28, 27, 30, 0.12)',
  onSurfaceDisabled: 'rgba(28, 27, 30, 0.38)',
  backdrop: 'rgba(50, 47, 56, 0.4)',
};

const theme = {
  ...MD3LightTheme,
  // Specify custom property
  colors,
};

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: theme,
});

console.log(theme.colors.primary);

export type AppTheme = typeof theme;

export const appTheme = theme;
export const navigationLightTheme = LightTheme;

export const useAppTheme = () => useTheme<AppTheme>();
