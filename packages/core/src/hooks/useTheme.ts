import { useThemeContext } from '../theme/ThemeProvider';
import { ThemeTokens } from '../types';

export interface UseThemeReturn {
  tokens: ThemeTokens;
  isDarkMode: boolean;
  colors: ThemeTokens['colors'];
  spacing: (value: number) => number;
  getColor: (color: string) => string;
}

export const useTheme = (): UseThemeReturn => {
  const { tokens, isDarkMode } = useThemeContext();

  const spacing = (value: number): number => {
    return tokens.spacing[value] || value;
  };

  const getColor = (color: string): string => {
    if (isDarkMode && tokens.colors.dark) {
      const darkColors = tokens.colors.dark as any;
      if (darkColors[color]) {
        return darkColors[color];
      }
    }
    
    const colors = tokens.colors as any;
    return colors[color] || color;
  };

  const effectiveColors = isDarkMode && tokens.colors.dark
    ? { ...tokens.colors, ...tokens.colors.dark }
    : tokens.colors;

  return {
    tokens,
    isDarkMode,
    colors: effectiveColors,
    spacing,
    getColor,
  };
};