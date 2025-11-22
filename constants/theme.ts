/**
 * Swiss City Navigation Color Palette (Swiss Design Inspired)
 * Clean, minimal, and high visibility - reflecting Swiss graphic design tradition
 */

import { Platform } from 'react-native';

// Swiss Design Color Palette
export const SwissColors = {
  // Primary Colors
  swissRed: '#D52B1E',        // Swiss Red - for important actions, destination pins
  transportBlue: '#005BBB',    // Transport Blue - main navigation, buttons, routes
  
  // Secondary Colors
  alpineGreen: '#2F8F4E',      // Alpine Green - parks, nature, secondary highlights
  swissWhite: '#F7F7F7',       // Swiss White - clean backgrounds
  neutralCharcoal: '#1C1C1C',  // Neutral Charcoal - titles, labels, text
  
  // Accent Colors
  cautionYellow: '#FFB300',    // Caution Yellow - alerts, warnings, POI highlights
  steelGray: '#B0B5BD',        // Steel Gray - borders, inactive tabs, cards
  
  // Text Colors
  textPrimary: '#1C1C1C',      // Primary text
  textSecondary: '#4A4A4A',    // Secondary text, subtitles
};

const tintColorLight = SwissColors.transportBlue;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: SwissColors.textPrimary,
    background: SwissColors.swissWhite,
    tint: tintColorLight,
    icon: SwissColors.steelGray,
    tabIconDefault: SwissColors.steelGray,
    tabIconSelected: SwissColors.transportBlue,
    card: '#FFFFFF',
    border: SwissColors.steelGray,
    primary: SwissColors.transportBlue,
    secondary: SwissColors.alpineGreen,
    accent: SwissColors.swissRed,
    warning: SwissColors.cautionYellow,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1C1C1C',
    border: '#333333',
    primary: SwissColors.transportBlue,
    secondary: SwissColors.alpineGreen,
    accent: SwissColors.swissRed,
    warning: SwissColors.cautionYellow,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
