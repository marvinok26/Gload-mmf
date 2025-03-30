
// constants/Colors.ts
const tintColorLight = '#2563EB';  // Blue-600 from our theme
const tintColorDark = '#3B82F6';   // Blue-500 from our theme

// Using named export
export const Colors = {
  light: {
    text: '#1F2937',
    background: '#F9FAFB',
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F9FAFB',
    background: '#1F2937',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
  },
};