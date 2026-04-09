// src/screens/auth/InstituteSelectScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
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

import InstituteCard from '../../components/institute/InstituteCard';
import SupportFooter from '../../components/common/SupportFooter';
import { radius } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';

// ─────────────────────────────────────────────────────────────────────────────
// InstituteSelectScreen Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * InstituteSelectScreen — Displayed after a user has been authenticated but
 * has not yet selected an institute context.
 *
 * Responsibilities:
 *  - Lists all institutes the authenticated user is associated with.
 *  - Shows a search bar when the list exceeds 5 institutes (to aid discovery).
 *  - On selection, calls `selectContext` to exchange the pre-context token for
 *    a full access token:
 *      • If the institute has multiple roles → navigate to RoleSelectScreen.
 *      • If only one role exists → finalize context automatically and navigate
 *        to the Dashboard.
 *  - Provides a logout option via the shared AuthHeader component.
 *
 * @param {object} navigation - React Navigation prop for screen transitions.
 */
const InstituteSelectScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { user, institutes, setSelectedInstitute, setSelectedRole, logout } =
    useAuth();
  const { width } = useWindowDimensions();

  // Local search query — only active when `showSearch` is true.
  const [search, setSearch] = useState('');

  // Tracks the loading state while the selectContext API call is in-flight.
  const [loading, setLoading] = useState(false);

  // Stores any API error message to be displayed inline.
  const [error, setError] = useState('');

  // Use a wider, centered layout on tablets or large screens.
  const isWide = width > 800;

  // Only render the search bar when there are more than 5 institutes,
  // as smaller lists don't benefit from filtering.
  const showSearch = institutes.length > 5;

  // ─── Data Normalisation ────────────────────────────────────────────────────

  /**
   * Normalise the raw institute objects from the API into a consistent shape
   * with predictable property names used throughout this screen and its
   * child components (InstituteCard, etc.).
   */
  const normalized = institutes.map(i => ({
    ...i,
    name: i.institute_name,
    logo: i.institute_logo || null,
    city: i.institute_city || '',
    state: i.institute_state || '',
    type: i.institute_type || 'School',
  }));

  // ─── Filtered List ─────────────────────────────────────────────────────────

  /**
   * Apply the search filter when `showSearch` is active.
   * Matches against institute name, city, and state (all case-insensitive).
   * When the search bar is hidden, all institutes are shown unfiltered.
   */
  const filtered = showSearch
    ? normalized.filter(
        i =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.city.toLowerCase().includes(search.toLowerCase()) ||
          i.state.toLowerCase().includes(search.toLowerCase()),
      )
    : normalized;

  /**
   * Words to highlight within InstituteCard when a search is active.
   * Passed to the card so it can bold or colour matching text.
   */
  const searchWords = showSearch && search.trim() ? [search.trim()] : [];

  // ─── Institute Selection Handler ───────────────────────────────────────────

  /**
   * Called when the user taps on an institute card.
   *
   * Logic:
   *  1. Persists the selected institute to auth context.
   *  2. If the institute has multiple roles → navigate to RoleSelectScreen
   *     so the user can choose their role.
   *  3. If only one role exists → call `selectContext` immediately to obtain
   *     an access token, store it, and navigate to the Dashboard.
   *
   * @param {object} institute - The normalised institute object from `filtered`.
   */
  const handleSelect = async institute => {
    setSelectedInstitute(institute);
    setError('');

    // Multiple roles available — delegate role selection to RoleSelectScreen.
    if (institute.roles.length > 1) {
      navigation.navigate('RoleSelect', { institute });
      return;
    }

    // Single role — finalise context automatically.
    setLoading(true);
    try {
      const role = institute.roles[0];
      const res = await selectContext({
        tenant_id: institute.tenant_id,
        institute_id: institute.institute_id,
        role_id: role.role_id,
      });

      // The pre-context token is no longer needed once a full access token
      // has been issued. Remove it to prevent stale token usage on next launch.
      await AsyncStorage.removeItem('pre_context_token');
      await AsyncStorage.setItem('access_token', res.access_token);

      setSelectedRole(role);

      // Reset the navigation stack so the user cannot press back and land on
      // this screen after reaching the Dashboard.
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (err) {
      setError(err.message || STRINGS.ERR_GENERIC);
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout Handler ────────────────────────────────────────────────────────

  /**
   * Clears all session data and redirects the user to the Login screen.
   * Uses `replace` so the user cannot navigate back to InstituteSelect
   * after logging out.
   */
  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  // ─── Derived Display Values ────────────────────────────────────────────────

  /** First letter of the user's full name — used as the avatar initial. */
  const userInitial = user?.full_name?.[0] || user?.initials || 'A';

  /** First name extracted from the user's full name for the greeting text. */
  const firstName =
    user?.full_name?.split(' ')[0] || user?.name?.split(' ')[0] || 'there';

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Shared top navigation header — contains the user avatar and logout button */}
      <AuthHeader userInitial={userInitial} onLogout={handleLogout} />

      {/*
        FlatList is used instead of ScrollView for performance:
        it virtualises off-screen institute cards and only renders visible ones.
      */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.institute_id}
        contentContainerStyle={[
          styles.listContent,
          isWide && styles.listContentWide,
        ]}
        ListHeaderComponent={
          <>
            {/* Personalised greeting */}
            <View style={styles.greeting}>
              <Text style={[styles.greetTitle, { color: colors.textPrimary }]}>
                {`${STRINGS.GREETING_HEY} ${firstName} 👋`}
              </Text>
              <Text style={[styles.greetSub, { color: colors.textSecondary }]}>
                {STRINGS.INSTITUTE_SELECT_SUBTITLE}
              </Text>
            </View>

            {/* Search bar — only shown when institute count exceeds 5 */}
            {showSearch && (
              <View
                style={[
                  styles.searchWrap,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                  },
                ]}
              >
                <AppIcons.Search
                  size={18}
                  color={colors.textMuted}
                  strokeWidth={2}
                />
                <TextInput
                  style={[styles.searchInput, { color: colors.inputText }]}
                  placeholder={STRINGS.PLACEHOLDER_SEARCH_INSTITUTES}
                  placeholderTextColor={colors.inputPlaceholder}
                  value={search}
                  onChangeText={setSearch}
                  autoCorrect={false}
                />
                {/* Clear button — only visible when there is an active search query */}
                {search.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearch('')}
                    activeOpacity={0.7}
                  >
                    <AppIcons.Close
                      size={16}
                      color={colors.textMuted}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Inline error message from the selectContext API call */}
            {error ? (
              <View style={styles.errorRow}>
                <AppIcons.AlertCircle
                  size={16}
                  color="#dc2626"
                  strokeWidth={2}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Empty state — shown when the search yields no results */}
            {filtered.length === 0 && (
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {STRINGS.INSTITUTE_EMPTY}
              </Text>
            )}
          </>
        }
        renderItem={({ item }) => (
          <InstituteCard
            institute={item}
            onClick={handleSelect}
            disabled={loading} // Prevents double-taps during API call.
            searchWords={searchWords} // Passes query words for text highlighting.
          />
        )}
      />

      {/* Fixed support footer with help/contact links */}
      <SupportFooter />
    </SafeAreaView>
  );
};

export default InstituteSelectScreen;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // FlatList content padding
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  // Constrain list width on wide/tablet screens
  listContentWide: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },

  // Greeting section
  greeting: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },
  greetTitle: {
    ...typography.heroTitle,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  greetSub: { ...typography.body, textAlign: 'center' },

  // Search input container
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },

  // Inline error row
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  errorText: { color: '#dc2626', ...typography.body },

  // Empty search results message
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    ...typography.body,
  },
});
