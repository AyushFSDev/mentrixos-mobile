/**
 * @file PublicLoginScreen.tsx
 * @module screens/auth/PublicLoginScreen
 * @description Entry-point authentication screen for unauthenticated users.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/useTheme';
import { useAuthFlow } from '../../hooks/useAuthFlow';
import { STRINGS } from '../../constants/strings';
import Icon from '../../components/common/Icon';
import AppIcons from '../../components/common/AppIcons';

import BrandHeader from '../../components/auth/BrandHeader';
import PhoneInput from '../../components/auth/PhoneInput';
import OtpInput from '../../components/auth/OtpInput';
import { SetupCard, Footer } from '../../components/auth/BottomSection';
import InputField from '../../components/common/InputField';
import PrimaryButton from '../../components/common/PrimaryButton';
import SecondaryButton from '../../components/common/SecondaryButton';
import Divider from '../../components/common/Divider';
import { RootStackParamList } from '../../navigation/RootNavigator';
import spacing from '../../theme/spacing';
import { insets } from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const PublicLoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const auth = useAuthFlow();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const isTablet = screenWidth >= 768;
  const isLandscape = screenWidth > screenHeight;
  const isPhoneLandscape = !isTablet && isLandscape;

  // ── Fix: ref use karke stable callback banao taaki focus na tute ──────────
  // auth.handleInputChange har render pe naya function hota hai (hook se),
  // isliye ref mein store karo aur callback ko empty deps do.
  const handleInputChangeRef = useRef(auth.handleInputChange);
  useEffect(() => {
    handleInputChangeRef.current = auth.handleInputChange;
  }, [auth.handleInputChange]);

  // Phone input ke liye stable callback — focus kabhi nahi tutega
  const handlePhoneInputChange = useCallback(
    (text: string) => handleInputChangeRef.current(text),
    [], // empty array: function identity stable rehegi across re-renders
  );

  // Email/default input ke liye stable callback — same fix
  const handleEmailInputChange = useCallback(
    (text: string) => handleInputChangeRef.current(text),
    [], // empty array: same reason
  );

  // ── Navigation handler ────────────────────────────────────────────────────
  useEffect(() => {
    if (!auth.nextRoute) return;

    if (auth.nextRoute === 'Dashboard') {
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } else if (auth.nextRoute === 'RoleSelect') {
      navigation.navigate('RoleSelect', auth.nextRouteParams ?? {});
    } else if (auth.nextRoute === 'InstituteSelect') {
      navigation.replace('InstituteSelect');
    }

    auth.clearNextRoute();
  }, [auth.nextRoute]);

  // ── Sub-render: Top Action Buttons ────────────────────────────────────────
  const renderTopButtons = (): React.ReactElement => (
    <View style={styles.topRow}>
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

  // ── Sub-render: Input Mode ────────────────────────────────────────────────
  const renderInputMode = (): React.ReactElement => {
    const isPhone = auth.inputType === 'phone';
    const isEmail = auth.inputType === 'email';

    return (
      <>
        {isPhone ? (
          <PhoneInput
            value={auth.rawInput}
            onChangeText={handlePhoneInputChange}
            placeholder={STRINGS.PLACEHOLDER_PHONE_NUMBER}
          />
        ) : (
          <InputField
            placeholder={STRINGS.PLACEHOLDER_PHONE_EMAIL}
            value={auth.rawInput}
            onChangeText={handleEmailInputChange}
            keyboardType={isEmail ? 'email-address' : 'default'}
            autoFocus
          />
        )}

        {isPhone && (
          <View style={styles.gap}>
            <PrimaryButton
              label={STRINGS.BTN_SEND_CODE}
              onPress={auth.handleSendCode}
              loading={auth.loading}
            />
          </View>
        )}

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

        <View style={styles.gap}>
          <Divider />
        </View>

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

  // ── Sub-render: OTP Mode ──────────────────────────────────────────────────
  const renderOtpMode = (): React.ReactElement => (
    <View>
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

      <View style={styles.gap}>
        <Text style={[styles.otpLabel, { color: colors.accentBlue }]}>
          {STRINGS.OTP_LABEL}
        </Text>
        <OtpInput otp={auth.otp} onChange={auth.handleOtpChange} />
      </View>

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

      <View style={styles.gap}>
        <PrimaryButton
          label={STRINGS.BTN_CONTINUE}
          onPress={auth.handleVerifyOtp}
          loading={auth.loading}
        />
      </View>

      <TouchableOpacity style={styles.gap} onPress={auth.handleBack}>
        <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
          {STRINGS.BTN_BACK}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ── Sub-render: Password Mode ─────────────────────────────────────────────
  const renderPasswordMode = (): React.ReactElement => (
    <View>
      <InputField
        placeholder={STRINGS.PLACEHOLDER_PHONE_EMAIL}
        value={auth.rawInput}
        onChangeText={() => {}}
        keyboardType="email-address"
        editable={false}
      />

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
            secureTextEntry={!showPassword}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />

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

      <TouchableOpacity style={styles.forgotRow} onPress={() => {}}>
        <Text style={[styles.forgotText, { color: colors.forgotLink }]}>
          {STRINGS.FORGOT_PASSWORD}
        </Text>
      </TouchableOpacity>

      <PrimaryButton
        label={STRINGS.BTN_CONTINUE}
        onPress={auth.handlePasswordLogin}
        loading={auth.loading}
      />

      <TouchableOpacity style={styles.gap} onPress={auth.handleBack}>
        <Text
          style={{
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: spacing.sm + 2,
          }}
        >
          {STRINGS.BTN_BACK}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ── Sub-render: Bottom Tagline ────────────────────────────────────────────
  const renderTagline = (): React.ReactElement => (
    <View style={styles.taglineBlock}>
      <Text style={[styles.taglineTitle, { color: colors.textPrimary }]}>
        {STRINGS.BOTTOM_TITLE}
      </Text>
      <Text style={[styles.taglineSub, { color: colors.textSecondary }]}>
        {STRINGS.BOTTOM_SUBTITLE}
      </Text>
    </View>
  );

  // ── Main Render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {isTablet && (
        <View style={styles.tabletTopButtons}>{renderTopButtons()}</View>
      )}

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.outerPad, isTablet && styles.outerPadTablet]}>
            {!isTablet && renderTopButtons()}

            <View
              style={[
                styles.card,
                isTablet && {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: radius.xl,
                  padding: spacing.xxl,
                  marginBottom: spacing.xl,
                },
              ]}
            >
              <BrandHeader />
              {auth.error ? (
                <Text style={[styles.error, { color: colors.errorText }]}>
                  {auth.error}
                </Text>
              ) : null}
              <View style={styles.form}>
                {auth.mode === 'input' && renderInputMode()}
                {auth.mode === 'otp' && renderOtpMode()}
                {auth.mode === 'password' && renderPasswordMode()}
              </View>
            </View>

            {!isPhoneLandscape && renderTagline()}
            <SetupCard onPress={() => {}} />
            <View style={styles.footerGap}>
              <Footer onLinkPress={() => {}} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PublicLoginScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex1: { flex: 1 },
  tabletTopButtons: {
    position: 'absolute',
    top: spacing.xxxl - 5,
    right: insets.screen,
    zIndex: 10,
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  scrollContent: { flexGrow: 1 },
  outerPad: {
    flex: 1,
    paddingHorizontal: insets.screen,
    paddingTop: spacing.sm + 6,
    paddingBottom: spacing.xxl - 4,
  },
  outerPadTablet: {
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  card: {},
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm + 2,
    marginBottom: spacing.xxl,
  },
  iconBtn: {
    width: insets.iconBtn,
    height: insets.iconBtn,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {},
  gap: { marginTop: spacing.sm + 6 },
  twoButtons: { flexDirection: 'row' },
  error: { fontSize: 13, textAlign: 'center', marginBottom: spacing.sm + 2 },
  otpLabel: { fontSize: 14, fontWeight: '600', marginBottom: spacing.md },
  resendRow: {
    flexDirection: 'row',
    marginTop: spacing.sm + 6,
    marginBottom: spacing.xs,
  },
  resendText: { fontSize: 14 },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  forgotText: { fontSize: 14, fontWeight: '600' },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs / 2,
  },
  passwordInput: { flex: 1, fontSize: 15, paddingVertical: spacing.md },
  eyeBtn: {
    paddingLeft: spacing.sm,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 100,
    paddingVertical: spacing.xl,
  },
  taglineTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  taglineSub: { fontSize: 13, textAlign: 'center' },
  footerGap: { marginTop: spacing.md },
});
