// src/screens/auth/PublicLoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { useAuthFlow } from '../../hooks/useAuthFlow';
import { STRINGS } from '../../constants/strings';
import Icon from '../../components/ui/Icon';
import AppIcons from '../../components/common/AppIcons';

import BrandHeader from '../../components/auth/BrandHeader';
import PhoneInput from '../../components/auth/PhoneInput';
import OtpInput from '../../components/auth/OtpInput';
import { SetupCard, Footer } from '../../components/auth/BottomSection';
import InputField from '../../components/ui/InputField';
import PrimaryButton from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import Divider from '../../components/ui/Divider';

// ─────────────────────────────────────────────────────────────────────────────
// PublicLoginScreen Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PublicLoginScreen — The entry-point authentication screen for unauthenticated
 * users. Supports three sequential login modes managed by `useAuthFlow`:
 *
 *  1. `input`    — User enters a phone number or email address.
 *  2. `otp`      — User enters the one-time passcode sent to their contact.
 *  3. `password` — User enters their account password (email path only).
 *
 * Layout adapts for phones, tablets, and landscape orientations:
 *  - Phone portrait  : standard single-column form.
 *  - Tablet          : form is constrained to 560 px and centered; top action
 *                      buttons are absolutely positioned in the top-right corner.
 *  - Phone landscape : tagline section is hidden to preserve vertical space.
 *
 * @param {object} navigation - React Navigation prop used for post-login navigation.
 */
const PublicLoginScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();

  /**
   * `auth` exposes the full authentication state machine:
   *   - mode, inputType, rawInput, otp, password, loading, error
   *   - handlers: handleInputChange, handleSendCode, handleUsePassword,
   *               handleOtpChange, handleVerifyOtp, handleResendCode,
   *               handlePasswordLogin, handleBack
   */
  const auth = useAuthFlow(navigation);

  // Tracks whether the password field content is visible or masked.
  const [showPassword, setShowPassword] = useState(false);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const isTablet = screenWidth >= 768;
  const isLandscape = screenWidth > screenHeight;
  const isPhoneLandscape = !isTablet && isLandscape;

  // ─── Sub-render: Top Action Buttons ────────────────────────────────────────

  /**
   * Renders the row of icon buttons in the top-right area of the screen.
   * Includes: report button, a placeholder button, and the theme toggle.
   *
   * On tablets this row is rendered absolutely positioned in the top-right
   * corner. On phones it is rendered inline above the brand header.
   */
  const renderTopButtons = () => (
    <View style={styles.topRow}>
      {/* Report / feedback button (placeholder — handler to be wired up) */}
      {/* <TouchableOpacity
        style={[
          styles.iconBtn,
          {
            backgroundColor: colors.iconBtnBg,
            borderColor: colors.iconBtnBorder,
          },
        ]}
        activeOpacity={0.8}
        accessibilityLabel={STRINGS.BTN_REPORT}
      >
        <Icon name="warning" size={20} color={colors.iconColor} />
      </TouchableOpacity> */}

      {/* Secondary action button (placeholder — handler to be wired up) */}
      <TouchableOpacity
        style={[
          styles.iconBtn,
          {
            backgroundColor: colors.iconBtnBg,
            borderColor: colors.iconBtnBorder,
          },
        ]}
        activeOpacity={0.8}
        accessibilityLabel={STRINGS.BTN_REPORT}
      >
        <Icon name="warning" size={20} color={colors.iconColor} />
      </TouchableOpacity>

      {/* Theme toggle: switches between light and dark mode */}
      <TouchableOpacity
        style={[
          styles.iconBtn,
          {
            backgroundColor: colors.iconBtnBg,
            borderColor: colors.iconBtnBorder,
          },
        ]}
        activeOpacity={0.8}
        onPress={toggleTheme}
        accessibilityLabel={
          isDark ? STRINGS.BTN_LIGHT_MODE : STRINGS.BTN_DARK_MODE
        }
      >
        <Icon
          name={isDark ? 'sun' : 'moon'}
          size={20}
          color={colors.iconColor}
        />
      </TouchableOpacity>
    </View>
  );

  // ─── Sub-render: Input Mode ─────────────────────────────────────────────────

  /**
   * Renders the initial credential-entry form.
   *
   * Behaviour differs by input type:
   *  - `phone` — Shows PhoneInput and a single "Send Code" button.
   *  - `email` — Shows a text InputField and two buttons side-by-side:
   *              "Send Code" (OTP path) and "Use Password" (password path).
   *
   * A QR-code "Join Institute" secondary button is shown below the divider
   * for all input types.
   */
  const renderInputMode = () => {
    const isPhone = auth.inputType === 'phone';
    const isEmail = auth.inputType === 'email';

    return (
      <>
        {/* Render the appropriate input component based on detected input type */}
        {isPhone ? (
          <PhoneInput
            value={auth.rawInput}
            onChangeText={auth.handleInputChange}
            placeholder={STRINGS.PLACEHOLDER_PHONE_NUMBER}
          />
        ) : (
          <InputField
            placeholder={STRINGS.PLACEHOLDER_PHONE_EMAIL}
            value={auth.rawInput}
            onChangeText={auth.handleInputChange}
            keyboardType={isEmail ? 'email-address' : 'default'}
            autoFocus
          />
        )}

        {/* Phone path: single "Send Code" button */}
        {isPhone && (
          <View style={styles.gap}>
            <PrimaryButton
              label={STRINGS.BTN_SEND_CODE}
              onPress={auth.handleSendCode}
              loading={auth.loading}
            />
          </View>
        )}

        {/* Email path: two buttons side-by-side for OTP or password login */}
        {isEmail && (
          <View style={[styles.gap, styles.twoButtons]}>
            <PrimaryButton
              label={STRINGS.BTN_SEND_CODE}
              onPress={auth.handleSendCode}
              loading={auth.loading}
              flex
            />
            <View style={{ width: 10 }} />
            <PrimaryButton
              label={STRINGS.BTN_USE_PASSWORD}
              onPress={auth.handleUsePassword}
              flex
            />
          </View>
        )}

        {/* Visual separator between primary and secondary actions */}
        <View style={styles.gap}>
          <Divider />
        </View>

        {/* Secondary action: join an institute via QR code scan */}
        <View style={styles.gap}>
          <SecondaryButton
            label={STRINGS.BTN_JOIN_INSTITUTE}
            iconName="qr"
            onPress={() => {}}
          />
        </View>
      </>
    );
  };

  // ─── Sub-render: OTP Mode ──────────────────────────────────────────────────

  /**
   * Renders the OTP verification form.
   *
   * The credential field (phone or email) is displayed as read-only so the
   * user can see which contact the code was sent to. Below it, an OTP input
   * component accepts the 4–6 digit passcode along with a resend link.
   */
  const renderOtpMode = () => (
    <View>
      {/* Read-only display of the contact the OTP was sent to */}
      {auth.inputType === 'phone' ? (
        <PhoneInput
          value={auth.rawInput}
          onChangeText={() => {}}
          placeholder={STRINGS.PLACEHOLDER_PHONE_NUMBER}
        />
      ) : (
        <InputField
          placeholder={STRINGS.PLACEHOLDER_PHONE_EMAIL}
          value={auth.rawInput}
          onChangeText={() => {}}
          keyboardType="email-address"
          editable={false}
        />
      )}

      {/* OTP entry section with label */}
      <View style={styles.gap}>
        <Text style={[styles.otpLabel, { color: colors.accentBlue }]}>
          {STRINGS.OTP_LABEL}
        </Text>
        <OtpInput otp={auth.otp} onChange={auth.handleOtpChange} />
      </View>

      {/* Resend code prompt */}
      <View style={styles.resendRow}>
        <Text style={[styles.resendText, { color: colors.resendText }]}>
          {STRINGS.OTP_RESEND_PREFIX}
        </Text>
        <TouchableOpacity onPress={auth.handleResendCode}>
          <Text style={[styles.resendLink, { color: colors.resendLink }]}>
            {STRINGS.OTP_RESEND_LINK}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verify and continue */}
      <View style={styles.gap}>
        <PrimaryButton
          label={STRINGS.BTN_CONTINUE}
          onPress={auth.handleVerifyOtp}
          loading={auth.loading}
        />
      </View>

      {/* Back link — returns to the credential input step */}
      <TouchableOpacity style={styles.gap} onPress={auth.handleBack}>
        <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
          {STRINGS.BTN_BACK}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Sub-render: Password Mode ─────────────────────────────────────────────

  /**
   * Renders the password entry form (email login path only).
   *
   * Features:
   *  - Read-only email field so the user can verify which account they are
   *    signing into.
   *  - Password field with an inline eye icon (AppIcons SVG) that toggles
   *    between masked and plain-text display.
   *  - "Forgot password?" link for account recovery.
   */
  const renderPasswordMode = () => (
    <View>
      {/* Read-only email field — not editable in password mode */}
      <InputField
        placeholder={STRINGS.PLACEHOLDER_PHONE_EMAIL}
        value={auth.rawInput}
        onChangeText={() => {}}
        keyboardType="email-address"
        editable={false}
      />

      {/* Password field with visibility toggle */}
      <View style={styles.gap}>
        <View
          style={[
            styles.passwordWrap,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
            },
          ]}
        >
          <TextInput
            style={[styles.passwordInput, { color: colors.inputText }]}
            placeholder={STRINGS.PLACEHOLDER_PASSWORD}
            placeholderTextColor={colors.inputPlaceholder}
            value={auth.password}
            onChangeText={auth.setPassword}
            secureTextEntry={!showPassword} // Masks input when showPassword is false.
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Eye icon button — toggles password visibility */}
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(prev => !prev)}
            activeOpacity={0.7}
            accessibilityLabel={
              showPassword
                ? STRINGS.BTN_HIDE_PASSWORD
                : STRINGS.BTN_SHOW_PASSWORD
            }
          >
            {showPassword ? (
              <AppIcons.EyeOff
                size={20}
                color={colors.textMuted}
                strokeWidth={1.8}
              />
            ) : (
              <AppIcons.EyeOn
                size={20}
                color={colors.textMuted}
                strokeWidth={1.8}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot password link — handler to be implemented */}
      <TouchableOpacity style={styles.forgotRow} onPress={() => {}}>
        <Text style={[styles.forgotText, { color: colors.forgotLink }]}>
          {STRINGS.FORGOT_PASSWORD}
        </Text>
      </TouchableOpacity>

      {/* Submit password and log in */}
      <PrimaryButton
        label={STRINGS.BTN_CONTINUE}
        onPress={auth.handlePasswordLogin}
        loading={auth.loading}
      />

      {/* Back link — returns to the credential input step */}
      <TouchableOpacity style={styles.gap} onPress={auth.handleBack}>
        <Text
          style={{
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          {STRINGS.BTN_BACK}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Sub-render: Bottom Tagline ─────────────────────────────────────────────

  /**
   * Renders the motivational tagline block shown below the form.
   * Hidden in phone-landscape mode to conserve vertical space.
   */
  const renderTagline = () => (
    <View style={styles.taglineBlock}>
      <Text style={[styles.taglineTitle, { color: colors.textPrimary }]}>
        {STRINGS.BOTTOM_TITLE}
      </Text>
      <Text style={[styles.taglineSub, { color: colors.textSecondary }]}>
        {STRINGS.BOTTOM_SUBTITLE}
      </Text>
    </View>
  );

  // ─── Main Render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />

      {/*
        On tablets, the top action buttons are rendered in an absolute-positioned
        container in the top-right corner so they don't push content down.
      */}
      {isTablet && (
        <View style={styles.tabletTopButtons}>{renderTopButtons()}</View>
      )}

      {/*
        KeyboardAvoidingView ensures the form scrolls up when the software
        keyboard appears. Uses 'padding' behavior on iOS; Android handles
        this natively via windowSoftInputMode.
      */}
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Taps outside the keyboard dismiss it without losing input.
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.outerPad, isTablet && styles.outerPadTablet]}>
            {/* Inline top buttons for phones (tablets use the absolute version above) */}
            {!isTablet && renderTopButtons()}

            {/* Main form card — gains visible card styling on tablets */}
            <View
              style={[
                styles.card,
                isTablet && {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 20,
                  padding: 28,
                  marginBottom: 20,
                },
              ]}
            >
              {/* Brand logo and app name */}
              <BrandHeader />

              {/* Inline error message — shown when auth.error is non-empty */}
              {auth.error ? (
                <Text style={[styles.error, { color: colors.errorText }]}>
                  {auth.error}
                </Text>
              ) : null}

              {/* Conditionally render the correct form based on the current auth mode */}
              <View style={styles.form}>
                {auth.mode === 'input' && renderInputMode()}
                {auth.mode === 'otp' && renderOtpMode()}
                {auth.mode === 'password' && renderPasswordMode()}
              </View>
            </View>

            {/* Tagline — hidden in phone landscape to save vertical space */}
            {!isPhoneLandscape && renderTagline()}

            {/* Institute setup prompt card */}
            <SetupCard />

            {/* App footer with links */}
            <View style={styles.footerGap}>
              <Footer />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PublicLoginScreen;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex1: { flex: 1 },

  // Absolute-positioned top buttons for tablet layout
  tabletTopButtons: {
    position: 'absolute',
    top: 35,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    gap: 10,
  },

  scrollContent: { flexGrow: 1 },

  // Outer padding container — phone defaults
  outerPad: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  // Override for tablet: narrower, centered layout
  outerPadTablet: {
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  card: {},
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 28,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: { marginBottom: 0 },
  gap: { marginTop: 14 },
  twoButtons: { flexDirection: 'row' },
  error: { fontSize: 13, textAlign: 'center', marginBottom: 10 },

  // OTP section
  otpLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  resendRow: { flexDirection: 'row', marginTop: 14, marginBottom: 4 },
  resendText: { fontSize: 14 },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // Forgot password link
  forgotRow: { alignItems: 'flex-end', marginTop: 8, marginBottom: 16 },
  forgotText: { fontSize: 14, fontWeight: '600' },

  // Password field with embedded eye icon
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  eyeBtn: {
    paddingLeft: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom tagline section
  taglineBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 100,
    paddingVertical: 20,
  },
  taglineTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  taglineSub: { fontSize: 13, textAlign: 'center' },

  footerGap: { marginTop: 12 },
});
