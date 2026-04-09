/**
 * @file colors.js
 * @module theme/colors
 * @description Design token color palettes for light and dark themes.
 *
 * Rules:
 *   - Every key in lightColors must have a matching key in darkColors.
 *   - Components must NEVER hardcode hex values — always reference a color
 *     token from the active palette via useTheme().colors.
 *   - To add a new token: add it to BOTH objects and keep the sections aligned.
 *
 * Usage:
 *   const { colors } = useTheme();
 *   <View style={{ backgroundColor: colors.surface }} />
 */

// ---------------------------------------------------------------------------
// Light theme
// ---------------------------------------------------------------------------
export const lightColors = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  background: '#EFEFEF', // Page / screen background
  surface: '#FFFFFF', // Cards, modals, input backgrounds

  // ── Borders ────────────────────────────────────────────────────────────────
  border: '#DEDEDE',

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary: '#000000',
  textSecondary: '#6B6B6B',
  textMuted: '#999999',
  textColor: '#07305D', // Accent text (e.g. divider label)

  // ── Brand & accent ─────────────────────────────────────────────────────────
  brandMentrix: '#000000',
  brandOS: '#1A7AFF',
  accentOrange: '#FF6B00',
  accentPurple: '#7B5FDB',
  accentBlue: '#1A7AFF',

  // ── Primary action button ──────────────────────────────────────────────────
  primaryBtn: '#1E6B5A',
  primaryBtnText: '#FFFFFF',

  // ── Secondary / outlined button ────────────────────────────────────────────
  secondaryBtn: '#FFFFFF',
  secondaryBtnBorder: '#DEDEDE',
  secondaryBtnText: '#000000',

  // ── Text inputs ────────────────────────────────────────────────────────────
  inputBg: '#FFFFFF',
  inputBorder: '#DEDEDE',
  inputText: '#000000',
  inputPlaceholder: '#AAAAAA',

  // ── Divider ("OR" separator) ───────────────────────────────────────────────
  dividerLine: '#CCCCCC',
  dividerText: '#1A7AFF',

  // ── Setup card (login screen) ──────────────────────────────────────────────
  setupCardBg: '#FFFFFF',
  setupCardBorder: '#E8E8E8',
  setupText: '#6B6B6B',
  setupLink: '#1A7AFF',

  // ── Legal footer ───────────────────────────────────────────────────────────
  footerText: '#999999',
  footerLink: '#1A7AFF',

  // ── Header icon buttons (theme toggle, report) ─────────────────────────────
  iconBtnBg: '#FFFFFF',
  iconBtnBorder: '#E0E0E0',
  iconColor: '#1A1A2E',

  // ── OTP input boxes ────────────────────────────────────────────────────────
  otpBorder: '#DEDEDE',
  otpBg: '#FFFFFF',
  otpText: '#000000',
  otpActiveBorder: '#1A7AFF', // Border color when the box contains a digit

  // ── OTP resend + forgot password links ─────────────────────────────────────
  resendText: '#000000',
  resendLink: '#1A7AFF',
  forgotLink: '#1A7AFF',

  // ── Country code selector (PhoneInput) ─────────────────────────────────────
  countryBg: '#FFFFFF',
  countryBorder: '#DEDEDE',
  countryText: '#000000',

  // ── Validation errors ──────────────────────────────────────────────────────
  errorText: '#D32F2F',
};

// ---------------------------------------------------------------------------
// Dark theme
// Every key mirrors lightColors exactly — same order, same sections.
// ---------------------------------------------------------------------------
export const darkColors = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  background: '#101010',
  surface: '#1C1C1C',

  // ── Borders ────────────────────────────────────────────────────────────────
  border: '#2C2C2C',

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#555555',
  textColor: '#C8C8C8',

  // ── Brand & accent ─────────────────────────────────────────────────────────
  brandMentrix: '#FFFFFF',
  brandOS: '#1A7AFF',
  accentOrange: '#FF6B00',
  accentPurple: '#7B9FFF', // Lighter purple for legibility on dark backgrounds
  accentBlue: '#1A7AFF',

  // ── Primary action button ──────────────────────────────────────────────────
  primaryBtn: '#1E6B5A',
  primaryBtnText: '#FFFFFF',

  // ── Secondary / outlined button ────────────────────────────────────────────
  secondaryBtn: '#1C1C1C',
  secondaryBtnBorder: '#3A3A3A',
  secondaryBtnText: '#FFFFFF',

  // ── Text inputs ────────────────────────────────────────────────────────────
  inputBg: '#1C1C1C',
  inputBorder: '#3A3A3A',
  inputText: '#FFFFFF',
  inputPlaceholder: '#555555',

  // ── Divider ("OR" separator) ───────────────────────────────────────────────
  dividerLine: '#2C2C2C',
  dividerText: '#888888',

  // ── Setup card (login screen) ──────────────────────────────────────────────
  setupCardBg: '#1C1C1C',
  setupCardBorder: '#2C2C2C',
  setupText: '#AAAAAA',
  setupLink: '#1A7AFF',

  // ── Legal footer ───────────────────────────────────────────────────────────
  footerText: '#555555',
  footerLink: '#1A7AFF',

  // ── Header icon buttons ─────────────────────────────────────────────────────
  iconBtnBg: '#1C1C1C',
  iconBtnBorder: '#3A3A3A',
  iconColor: '#FFFFFF',

  // ── OTP input boxes ────────────────────────────────────────────────────────
  otpBorder: '#3A3A3A',
  otpBg: '#1C1C1C',
  otpText: '#FFFFFF',
  otpActiveBorder: '#1A7AFF',

  // ── OTP resend + forgot password links ─────────────────────────────────────
  resendText: '#FFFFFF',
  resendLink: '#1A7AFF',
  forgotLink: '#1A7AFF',

  // ── Country code selector ──────────────────────────────────────────────────
  countryBg: '#1C1C1C',
  countryBorder: '#3A3A3A',
  countryText: '#FFFFFF',

  // ── Validation errors ──────────────────────────────────────────────────────
  errorText: '#FF6B6B', // Lighter red for legibility on dark backgrounds
};
