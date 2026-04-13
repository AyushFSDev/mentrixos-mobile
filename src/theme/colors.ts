/**
 * @file colors.ts
 * @module theme/colors
 * @description Design token color palettes for light and dark themes.
 *
 * Rules:
 *   - Every key in lightColors must have a matching key in darkColors.
 *   - Components must NEVER hardcode hex values — always reference a color
 *     token from the active palette via useTheme().colors.
 *
 * Usage:
 *   const { colors } = useTheme();
 *   <View style={{ backgroundColor: colors.surface }} />
 */

// ---------------------------------------------------------------------------
// Color palette type — ensures lightColors and darkColors stay in sync
// ---------------------------------------------------------------------------
export interface ColorPalette {
  // Backgrounds
  background: string;
  surface: string;

  // Borders
  border: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textColor: string;

  // Brand & accent
  brandMentrix: string;
  brandOS: string;
  accentOrange: string;
  accentPurple: string;
  accentBlue: string;

  // Primary action button
  primaryBtn: string;
  primaryBtnText: string;

  // Secondary / outlined button
  secondaryBtn: string;
  secondaryBtnBorder: string;
  secondaryBtnText: string;

  // Text inputs
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;

  // Divider
  dividerLine: string;
  dividerText: string;

  // Setup card
  setupCardBg: string;
  setupCardBorder: string;
  setupText: string;
  setupLink: string;

  // Legal footer
  footerText: string;
  footerLink: string;

  // Header icon buttons
  iconBtnBg: string;
  iconBtnBorder: string;
  iconColor: string;

  // OTP input boxes
  otpBorder: string;
  otpBg: string;
  otpText: string;
  otpActiveBorder: string;

  // OTP resend + forgot password links
  resendText: string;
  resendLink: string;
  forgotLink: string;

  // Country code selector
  countryBg: string;
  countryBorder: string;
  countryText: string;

  // Validation errors
  errorText: string;
}

// ---------------------------------------------------------------------------
// Light theme
// ---------------------------------------------------------------------------
export const lightColors: ColorPalette = {
  background: '#EFEFEF',
  surface: '#FFFFFF',

  border: '#DEDEDE',

  textPrimary: '#000000',
  textSecondary: '#6B6B6B',
  textMuted: '#999999',
  textColor: '#07305D',

  brandMentrix: '#000000',
  brandOS: '#1A7AFF',
  accentOrange: '#FF6B00',
  accentPurple: '#7B5FDB',
  accentBlue: '#1A7AFF',

  primaryBtn: '#1E6B5A',
  primaryBtnText: '#FFFFFF',

  secondaryBtn: '#FFFFFF',
  secondaryBtnBorder: '#DEDEDE',
  secondaryBtnText: '#000000',

  inputBg: '#FFFFFF',
  inputBorder: '#DEDEDE',
  inputText: '#000000',
  inputPlaceholder: '#AAAAAA',

  dividerLine: '#CCCCCC',
  dividerText: '#1A7AFF',

  setupCardBg: '#FFFFFF',
  setupCardBorder: '#E8E8E8',
  setupText: '#6B6B6B',
  setupLink: '#1A7AFF',

  footerText: '#999999',
  footerLink: '#1A7AFF',

  iconBtnBg: '#FFFFFF',
  iconBtnBorder: '#E0E0E0',
  iconColor: '#1A1A2E',

  otpBorder: '#DEDEDE',
  otpBg: '#FFFFFF',
  otpText: '#000000',
  otpActiveBorder: '#1A7AFF',

  resendText: '#000000',
  resendLink: '#1A7AFF',
  forgotLink: '#1A7AFF',

  countryBg: '#FFFFFF',
  countryBorder: '#DEDEDE',
  countryText: '#000000',

  errorText: '#D32F2F',
};

// ---------------------------------------------------------------------------
// Dark theme
// ---------------------------------------------------------------------------
export const darkColors: ColorPalette = {
  background: '#101010',
  surface: '#1C1C1C',

  border: '#2C2C2C',

  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#555555',
  textColor: '#C8C8C8',

  brandMentrix: '#FFFFFF',
  brandOS: '#1A7AFF',
  accentOrange: '#FF6B00',
  accentPurple: '#7B9FFF',
  accentBlue: '#1A7AFF',

  primaryBtn: '#1E6B5A',
  primaryBtnText: '#FFFFFF',

  secondaryBtn: '#1C1C1C',
  secondaryBtnBorder: '#3A3A3A',
  secondaryBtnText: '#FFFFFF',

  inputBg: '#1C1C1C',
  inputBorder: '#3A3A3A',
  inputText: '#FFFFFF',
  inputPlaceholder: '#555555',

  dividerLine: '#2C2C2C',
  dividerText: '#888888',

  setupCardBg: '#1C1C1C',
  setupCardBorder: '#2C2C2C',
  setupText: '#AAAAAA',
  setupLink: '#1A7AFF',

  footerText: '#555555',
  footerLink: '#1A7AFF',

  iconBtnBg: '#1C1C1C',
  iconBtnBorder: '#3A3A3A',
  iconColor: '#FFFFFF',

  otpBorder: '#3A3A3A',
  otpBg: '#1C1C1C',
  otpText: '#FFFFFF',
  otpActiveBorder: '#1A7AFF',

  resendText: '#FFFFFF',
  resendLink: '#1A7AFF',
  forgotLink: '#1A7AFF',

  countryBg: '#1C1C1C',
  countryBorder: '#3A3A3A',
  countryText: '#FFFFFF',

  errorText: '#FF6B6B',
};