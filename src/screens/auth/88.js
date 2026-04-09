// src/screens/auth/PublicLoginScreen.js
// NOTE: This is an earlier/alternate version of PublicLoginScreen.
//       It implements only the `input` mode (phone/email entry) and uses a
//       fixed bottom section rather than an inline scrollable footer.
//       See PublicLoginScreen.js for the full multi-mode implementation.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme }    from '../../hooks/useTheme';
import { useAuthFlow } from '../../hooks/useAuthFlow';
import { STRINGS }     from '../../constants/strings';
import Icon            from '../../components/ui/Icon';

import BrandHeader    from '../../components/auth/BrandHeader';
import PhoneInput     from '../../components/auth/PhoneInput';
import { SetupCard, Footer } from '../../components/auth/BottomSection';
import InputField     from '../../components/ui/InputField';
import PrimaryButton  from '../../components/ui/PrimaryButton';
import SecondaryButton from '../../components/ui/SecondaryButton';
import Divider        from '../../components/ui/Divider';
import OtpInput       from '../../components/auth/OtpInput';

// ─────────────────────────────────────────────────────────────────────────────
// PublicLoginScreen Component (Simplified / Alternate Version)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PublicLoginScreen — A simplified login screen that handles credential entry
 * (phone or email) and renders the OTP / password modes as future extensions.
 *
 * Layout strategy:
 *  - The scrollable area uses `justifyContent: 'space-between'` so the form
 *    sits at the top and the tagline is vertically centred in any remaining
 *    space below it.
 *  - SetupCard and Footer are placed in a fixed bottom section outside the
 *    ScrollView so they remain anchored at the bottom regardless of keyboard
 *    or content height changes.
 *
 * @param {object} navigation - React Navigation prop (not currently used
 *                              directly; navigation is handled by useAuthFlow).
 */
const PublicLoginScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  /**
   * `auth` exposes the authentication state machine and all handlers.
   * Note: `navigation` is not passed here — wire it in if post-auth
   * navigation needs to be triggered from within useAuthFlow.
   */
  const auth = useAuthFlow();

  // ─── Sub-render: Top Action Buttons ────────────────────────────────────────

  /**
   * Renders the icon button row in the top-right corner of the screen.
   * Includes a report/feedback button and a theme toggle button.
   *
   * Note: The theme toggle icon is rendered here but `toggleTheme` is not
   * wired up — add `onPress={toggleTheme}` when integrating the full flow.
   */
  const renderTopButtons = () => (
    <View style={styles.topRow_unique}>
      {/* Report / feedback button (handler to be implemented) */}
      <TouchableOpacity
        style={[
          styles.iconBtn_unique,
          { backgroundColor: colors.iconBtnBg, borderColor: colors.iconBtnBorder },
        ]}
        activeOpacity={0.8}
      >
        <Icon name="warning" size={20} color={colors.iconColor} />
      </TouchableOpacity>

      {/* Theme toggle button (onPress handler to be wired up) */}
      <TouchableOpacity
        style={[
          styles.iconBtn_unique,
          { backgroundColor: colors.iconBtnBg, borderColor: colors.iconBtnBorder },
        ]}
        activeOpacity={0.8}
      >
        {/* Shows sun icon in dark mode, moon icon in light mode */}
        <Icon name={isDark ? 'sun' : 'moon'} size={20} color={colors.iconColor} />
      </TouchableOpacity>
    </View>
  );

  // ─── Sub-render: Input Mode ─────────────────────────────────────────────────

  /**
   * Renders the credential-entry form for both phone and email inputs.
   *
   * Behaviour by input type:
   *  - `phone` — PhoneInput component + a single "Send Code" primary button.
   *  - `email` — Text InputField + two side-by-side primary buttons:
   *              "Send Code" (OTP) and "Use Password".
   *
   * A QR-code secondary button for joining an institute is shown below the
   * visual divider for all input types.
   */
  const renderInputMode = () => {
    const isPhone = auth.inputType === 'phone';
    const isEmail = auth.inputType === 'email';

    return (
      <>
        {/* Render the appropriate input field based on detected input type */}
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

        {/* Phone path: single "Send OTP" action */}
        {isPhone && (
          <View style={styles.gap_unique}>
            <PrimaryButton
              label={STRINGS.BTN_SEND_CODE}
              onPress={auth.handleSendCode}
              loading={auth.loading}
            />
          </View>
        )}

        {/* Email path: two actions side-by-side — OTP or password login */}
        {isEmail && (
          <View style={[styles.gap_unique, styles.twoButtons_unique]}>
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

        {/* Visual divider between primary and secondary actions */}
        <View style={styles.gap_unique}>
          <Divider />
        </View>

        {/* QR code join action for institute onboarding */}
        <View style={styles.gap_unique}>
          <SecondaryButton
            label={STRINGS.BTN_JOIN_INSTITUTE}
            iconName="qr"
            onPress={() => {}}
          />
        </View>
      </>
    );
  };

  // ─── Main Render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safe_unique, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/*
        KeyboardAvoidingView shifts the scrollable content up when the
        software keyboard is visible. Uses 'padding' mode on iOS; Android
        handles keyboard avoidance via the manifest's windowSoftInputMode.
      */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/*
          ScrollView with `justifyContent: 'space-between'`:
          - The top section (form) sticks to the top.
          - The tagline section expands to fill remaining space and centres
            itself vertically within it.
        */}
        <ScrollView
          contentContainerStyle={styles.scroll_unique}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Top Section: action buttons, brand header, form ── */}
          <View>
            {renderTopButtons()}
            <BrandHeader />

            {/* Inline error message — displayed when auth.error is non-empty */}
            {auth.error ? (
              <Text style={[styles.error_unique, { color: colors.errorText }]}>
                {auth.error}
              </Text>
            ) : null}

            {/* Active form — only `input` mode is implemented in this version */}
            <View style={styles.form_unique}>
              {auth.mode === 'input' && renderInputMode()}
              {/*
                TODO: Add renderOtpMode() and renderPasswordMode() here when
                extending this screen to support the full auth flow.
              */}
            </View>
          </View>

          {/*
            ── Tagline Section ──
            Placed at the end of the ScrollView so it occupies the remaining
            vertical space and appears vertically centred below the form.
            `flex: 1` on the container + `justifyContent: 'center'` achieves
            this without hard-coded pixel offsets.
          */}
          <View style={styles.midTagline_unique}>
            <Text style={[styles.midTitle_unique, { color: colors.textPrimary }]}>
              {STRINGS.BOTTOM_TITLE}
            </Text>
            <Text style={[styles.midSub_unique, { color: colors.textSecondary }]}>
              {STRINGS.BOTTOM_SUBTITLE}
            </Text>
          </View>
        </ScrollView>

        {/*
          ── Fixed Bottom Section ──
          Rendered outside the ScrollView so it always stays anchored at the
          bottom of the screen, even when the keyboard is open or the content
          is short.
        */}
        <View
          style={[
            styles.bottomFixed_unique,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Institute setup prompt card */}
          <SetupCard />

          {/* App footer with terms / privacy links */}
          <View style={styles.footerGap_unique}>
            <Footer />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PublicLoginScreen;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /** Full-screen container — background colour is theme-driven. */
  safe_unique: { flex: 1 },

  /**
   * ScrollView content container.
   * `flexGrow: 1` allows the container to expand to fill the available height.
   * `justifyContent: 'space-between'` pushes the tagline section to the bottom
   * of the remaining space below the form.
   */
  scroll_unique: {
    flexGrow:          1,
    paddingHorizontal: 20,
    paddingTop:        14,
    paddingBottom:     10,
    justifyContent:    'space-between',
  },

  // Top action button row
  topRow_unique: {
    flexDirection:  'row',
    justifyContent: 'flex-end',
    gap:            10,
    marginBottom:   28,
  },
  iconBtn_unique: {
    width:           46,
    height:          46,
    borderRadius:    12,
    borderWidth:     1,
    alignItems:      'center',
    justifyContent:  'center',
  },

  form_unique:       { marginBottom: 8 },
  gap_unique:        { marginTop: 14 },
  twoButtons_unique: { flexDirection: 'row' },

  /**
   * Tagline container.
   * `flex: 1` causes this view to occupy all remaining vertical space in the
   * ScrollView after the form section. `justifyContent: 'center'` then centres
   * the text within that space, creating a natural vertically-centred feel.
   * `minHeight` ensures the block is visible even when there is very little
   * remaining space.
   */
  midTagline_unique: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    minHeight:      80,
  },
  midTitle_unique: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  midSub_unique:   { fontSize: 13 },

  // Fixed bottom section anchored outside the ScrollView
  bottomFixed_unique: {
    paddingHorizontal: 20,
    paddingBottom:     16,
  },
  footerGap_unique: { marginTop: 12 },

  error_unique: {
    fontSize:     13,
    textAlign:    'center',
    marginBottom: 10,
  },
});