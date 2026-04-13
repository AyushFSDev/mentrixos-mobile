// src/screens/auth/InstituteSelectScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { finalizeContext } from '../../services/auth/auth-service';
import { mapError, resolveInstituteNextStep } from '../../utils/auth-utils';
import { STRINGS } from '../../constants/strings';
import AppIcons from '../../components/common/AppIcons';
import AuthHeader from '../../components/common/AuthHeader';
import InstituteCard, {
  Institute,
} from '../../components/institute/InstituteCard';
import SupportFooter from '../../components/common/SupportFooter';
import FullScreenLoader from '../../components/common/FullScreenLoader';
import { useDeviceType } from '../../hooks/useDeviceType';
import { radius } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'InstituteSelect'>;

// ---------------------------------------------------------------------------
// Normalized institute shape used within this screen
// ---------------------------------------------------------------------------
interface NormalizedInstitute extends Institute {
  institute_id: string;
  tenant_id: string;
  roles: Array<{ role_id: string; [key: string]: unknown }>;
  institute_name?: string;
  institute_logo?: string;
  institute_city?: string;
  institute_state?: string;
  institute_type?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const InstituteSelectScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, institutes, setSelectedInstitute, setSelectedRole, logout } =
    useAuth();
  const { isWide } = useDeviceType();

  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const showSearch = institutes.length > 5;

  // ─── Data Normalisation ────────────────────────────────────────────────────
  const normalized: NormalizedInstitute[] = (
    institutes as NormalizedInstitute[]
  ).map(i => ({
    ...i,
    name: i.institute_name,
    logo: i.institute_logo || null,
    city: i.institute_city || '',
    state: i.institute_state || '',
    type: i.institute_type || 'School',
  }));

  // ─── Filtered List ─────────────────────────────────────────────────────────
  const filtered: NormalizedInstitute[] = showSearch
    ? normalized.filter(
        i =>
          (i.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (i.city ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (i.state ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : normalized;

  const searchWords: string[] =
    showSearch && search.trim() ? [search.trim()] : [];

  // ─── Selection Handler ─────────────────────────────────────────────────────
  const handleSelect = async (institute: Institute): Promise<void> => {
    const inst = institute as NormalizedInstitute;
    setSelectedInstitute(inst as any);
    setError('');

    if (resolveInstituteNextStep(inst) === 'roleSelect') {
      navigation.navigate('RoleSelect', { institute: inst });
      return;
    }

    setLoading(true);
    try {
      const role = inst.roles[0];
      await finalizeContext({
        tenant_id: inst.tenant_id,
        institute_id: inst.institute_id,
        role_id: role.role_id,
      });

      setSelectedRole(role as any);
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout Handler ────────────────────────────────────────────────────────
  const handleLogout = async (): Promise<void> => {
    await logout();
    navigation.replace('Login');
  };

  const userInitial =
    (user as any)?.full_name?.[0] || (user as any)?.initials || 'A';
  const firstName =
    (user as any)?.full_name?.split(' ')[0] ||
    user?.name?.split(' ')[0] ||
    'there';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <AuthHeader userInitial={userInitial} onLogout={handleLogout} />

      <FlatList<NormalizedInstitute>
        data={filtered}
        keyExtractor={item => item.institute_id}
        contentContainerStyle={[
          styles.listContent,
          isWide && styles.listContentWide,
        ]}
        ListHeaderComponent={
          <>
            <View style={styles.greeting}>
              <Text
                style={[styles.greetTitle, { color: colors.textPrimary }]}
              >{`${STRINGS.GREETING_HEY} ${firstName} 👋`}</Text>
              <Text style={[styles.greetSub, { color: colors.textSecondary }]}>
                {STRINGS.INSTITUTE_SELECT_SUBTITLE}
              </Text>
            </View>

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

            {error ? (
              <View style={styles.errorRow}>
                <AppIcons.AlertCircle
                  size={16}
                  color={colors.errorText}
                  strokeWidth={2}
                />
                <Text style={[styles.errorText, { color: colors.errorText }]}>
                  {error}
                </Text>
              </View>
            ) : null}

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
            disabled={loading}
            searchWords={searchWords}
          />
        )}
      />

      <SupportFooter />
      <FullScreenLoader visible={loading} />
    </SafeAreaView>
  );
};

export default InstituteSelectScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  listContentWide: { maxWidth: 600, alignSelf: 'center', width: '100%' },
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
  searchInput: { flex: 1, fontSize: 15 },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  errorText: { ...typography.body },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    ...typography.body,
  },
});
