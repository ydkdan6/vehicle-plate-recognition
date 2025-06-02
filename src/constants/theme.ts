export const COLORS = {
  // Primary colors
  primary: {
    100: '#E6F2FF', // Lightest primary
    200: '#CCE5FF',
    300: '#99CAFF',
    400: '#66AFFF',
    500: '#0A84FF', // Primary
    600: '#0070E0',
    700: '#005BB8',
    800: '#004590',
    900: '#002E68', // Darkest primary
  },
  
  // Secondary colors
  secondary: {
    100: '#F2F2F7', // Lightest secondary
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C7C7CC',
    500: '#8E8E93', // Secondary
    600: '#636366',
    700: '#48484A',
    800: '#3A3A3C',
    900: '#1C1C1E', // Darkest secondary
  },
  
  // Accent colors
  accent: {
    100: '#E5F9F0',
    200: '#BEF0D9',
    300: '#8CE6BF',
    400: '#5DDCA5',
    500: '#30D158', // Accent
    600: '#28B148',
    700: '#209139',
    800: '#18712B',
    900: '#10501D',
  },
  
  // Status colors
  success: '#34C759', // Green
  warning: '#FF9500', // Orange
  error: '#FF3B30',   // Red
  info: '#5AC8FA',    // Blue
  
  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA',
  },
  
  // Text
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    inverse: '#FFFFFF',
  },
};

export const FONT = {
  // Font sizes
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 34,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,  // For headings (120%)
    normal: 1.5, // For body text (150%)
    relaxed: 1.75, // For more readable text
  },
  
  // Font weights
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const SIZES = {
  // Base sizing
  base: 8,
  
  // Padding
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Margins
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    circular: 9999,
  },
  
  // Screen dimensions
  screen: {
    width: 0, // Will be updated at runtime
    height: 0, // Will be updated at runtime
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export default { COLORS, FONT, SIZES, SHADOWS };