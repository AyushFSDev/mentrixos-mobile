// src/screens/auth/RoleSelectScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { selectContext } from '../../services/api-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STRINGS } from '../../constants/strings';
import AppIcons from '../../components/common/AppIcons';
import AuthHeader from '../../components/common/AuthHeader';

import RoleCard from '../../components/role/RoleCard';
import SupportFooter from '../../components/common/SupportFooter';
import SelectedInstituteCard from '../../components/institute/SelectedInstituteCard';
import { radius } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';

// ─────────────────────────────────────────────────────────────────────────────
// RoleSelectScreen Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * RoleSelectScreen — Allows the user to choose one of the multiple roles
 * available to them within a selected institute.
 *
 * This screen is only reached when the institute selected in
 * InstituteSelectScreen has `institute.roles.length > 1`. For single-role
 * institutes, the context is resolved automatically in InstituteSelectScreen.
 *
 * Responsibilities:
 *  - Displays the selected institute's details via SelectedInstituteCard.
 *  - Lists all available roles as tappable RoleCard items.
 *  - Calls `selectContext` on role selection to exchange tokens and navigate
 *    to the Dashboard via `navigation.reset()` (clearing the back stack).
 *  - Shows a "Change Institute" back button when the user belongs to more
 *    than one institute.
 *  - Provides logout via the shared AuthHeader.
 *
 * Hook ordering follows React's Rules of Hooks — all hooks are called
 * unconditionally at the top of the component before any derived logic.
 *
 * @param {object} navigation - React Navigation prop for screen transitions.
 * @param {object} route      - Contains `route.params.institute` passed from
 *                              InstituteSelectScreen.
 */
const RoleSelectScreen = ({ navigation, route }) => {
  // ─── Hooks (must remain in fixed order, no conditionals) ─────────────────
  const { colors, isDark } = useTheme();
  const { user, institutes, setSelectedInstitute, setSelectedRole, logout } =
    useAuth();
  const { width } = useWindowDimensions();

  // ID of the role card currently being processed (shows a loading indicator).
  const [selectedId, setSelectedId] = useState(null);

  // Tracks whether a selectContext API call is in-flight.
  const [loading, setLoading] = useState(false);

  // Stores any API error message to display inline.
  const [error, setError] = useState('');

  // ─── Derived Values (after hooks) ────────────────────────────────────────

  /** Institute object passed via route params from InstituteSelectScreen. */
  const institute = route.params?.institute;

  /** Use a wider, centered layout on tablets or large screens. */
  const isWide = width > 800;

  /** List of roles available for the selected institute. */
  const roles = institute?.roles || [];

  /**
   * Determines whether to show the "Change Institute" back button.
   * Only relevant when the user is associated with more than one institute.
   */
  const hasMultiInstitute = (institutes?.length || 0) > 1;

  /** First letter of the user's name for the avatar initial in AuthHeader. */
  const userInitial = user?.full_name?.[0] || user?.initials || 'A';

  // ─── Effects ──────────────────────────────────────────────────────────────

  /**
   * Sync the selected institute into the auth context whenever the institute
   * ID changes (e.g., on first mount or if the user navigates back and picks
   * a different institute).
   *
   * The dependency is `institute?.institute_id` rather than the whole
   * `institute` object to avoid triggering on every render when the parent
   * provides a new object reference with the same data.
   */
  useEffect(() => {
    if (institute?.institute_id) {
      setSelectedInstitute(institute);
    }
  }, [institute?.institute_id]);

  // ─── Role Selection Handler ───────────────────────────────────────────────

  /**
   * Called when the user taps a role card.
   *
   * Steps:
   *  1. Mark the tapped role as selected (shows a loading state on the card).
   *  2. Call `selectContext` to exchange the pre-context token for a full
   *     access token scoped to the chosen institute and role.
   *  3. Remove both the old access token and pre-context token, then store
   *     the new access token.
   *  4. Persist the selected role in auth context.
   *  5. Reset the navigation stack to Dashboard so the hardware back button
   *     cannot return the user to this role-selection screen.
   *
   * @param {object} role - The role object containing at least `role_id`.
   */
  const handleSelect = async role => {
    setSelectedId(role.role_id);
    setLoading(true);
    setError('');

    try {
      const res = await selectContext({
        tenant_id: institute.tenant_id,
        institute_id: institute.institute_id,
        role_id: role.role_id,
      });

      // Clear all pre-authentication tokens before storing the new access token.
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('pre_context_token');
      await AsyncStorage.setItem('access_token', res.access_token);

      setSelectedRole(role);

      // `navigation.reset` clears the stack entirely so the user cannot press
      // back from Dashboard and return to this screen.
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (err) {
      setError(err.message || STRINGS.ERR_GENERIC);
      setSelectedId(null); // De-select the card so the user can try again.
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout Handler ────────────────────────────────────────────────────────

  /**
   * Clears all session data and redirects the user to the Login screen.
   * Uses `replace` so the user cannot navigate back to RoleSelect after
   * logging out.
   */
  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Shared top navigation header with user avatar and logout button */}
      <AuthHeader userInitial={userInitial} onLogout={handleLogout} />

      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/*
          "Change Institute" pill button — shown only when the user belongs
          to more than one institute, allowing them to go back and pick a
          different one without logging out.
        */}
        {hasMultiInstitute && (
          <View style={styles.backRow}>
            <TouchableOpacity
              style={[
                styles.backBtn,
                {
                  backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                  borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                },
              ]}
              onPress={() => navigation.navigate('InstituteSelect')}
              activeOpacity={0.75}
            >
              <AppIcons.ArrowLeft
                size={16}
                color={isDark ? '#fff' : '#475569'}
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.backLabel,
                  { color: isDark ? '#fff' : '#475569' },
                ]}
              >
                {STRINGS.ROLE_CHANGE_INSTITUTE}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Summary card showing the currently selected institute's details */}
        {institute && (
          <SelectedInstituteCard
            institute={{
              name: institute.institute_name,
              logo: institute.institute_logo,
              city: institute.institute_city,
              state: institute.institute_state,
            }}
          />
        )}

        {/* Greeting and instruction text */}
        <View style={styles.greeting}>
          <Text style={[styles.greetTitle, { color: colors.textPrimary }]}>
            {STRINGS.ROLE_SELECT_TITLE}
          </Text>
          <Text style={[styles.greetSub, { color: colors.textSecondary }]}>
            {STRINGS.ROLE_SELECT_SUBTITLE}
          </Text>
        </View>

        {/* Inline error message from the selectContext API call */}
        {error ? (
          <View style={styles.errorRow}>
            <AppIcons.AlertCircle size={16} color="#dc2626" strokeWidth={2} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Role cards list — each card is a tappable role option */}
        <View style={styles.list}>
          {roles.map(role => (
            <RoleCard
              key={role.role_id}
              role={role}
              isSelected={selectedId === role.role_id} // Highlights the active card.
              onClick={loading ? () => {} : handleSelect} // Disables all cards while an API call is in-flight.
            />
          ))}
        </View>
      </ScrollView>

      {/* Fixed support footer with help/contact links */}
      <SupportFooter />
    </SafeAreaView>
  );
};

export default RoleSelectScreen;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // Scrollable content area
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  // Constrain content width on wide/tablet screens
  contentWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },

  // "Change Institute" back button row
  backRow: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  backLabel: { ...typography.label, fontSize: 14 },

  // Greeting section
  greeting: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.xxl,
  },
  greetTitle: {
    ...typography.heroTitle,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  greetSub: { ...typography.body, textAlign: 'center', marginTop: spacing.sm },

  // Inline error row
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  errorText: { color: '#dc2626', ...typography.body },

  // Role cards list — gap between each card
  list: { gap: spacing.sm },
});
