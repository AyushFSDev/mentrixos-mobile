// src/screens/auth/RoleSelectScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../hooks/useTheme';
import { useAuth, Role } from '../../hooks/useAuth';
import { finalizeContext } from '../../services/auth/auth-service';
import { mapError } from '../../utils/auth-utils';
import { STRINGS } from '../../constants/strings';
import AppIcons from '../../components/common/AppIcons';
import AuthHeader from '../../components/common/AuthHeader';
import RoleCard from '../../components/role/RoleCard';
import SupportFooter from '../../components/common/SupportFooter';
import SelectedInstituteCard from '../../components/institute/SelectedInstituteCard';
import FullScreenLoader from '../../components/common/FullScreenLoader';
import { useDeviceType } from '../../hooks/useDeviceType';
import { radius } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelect'>;

interface InstituteParam {
  institute_id: string;
  tenant_id: string;
  institute_name?: string;
  institute_logo?: string;
  institute_city?: string;
  institute_state?: string;
  roles: Role[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const RoleSelectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { user, institutes, setSelectedInstitute, setSelectedRole, logout } =
    useAuth();
  const { isWide } = useDeviceType();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const institute = route.params?.institute as InstituteParam | undefined;
  const roles: Role[] = (institute?.roles || []) as Role[];
  const hasMultiInstitute = (institutes?.length || 0) > 1;
  const userInitial =
    (user as any)?.full_name?.[0] || (user as any)?.initials || 'A';

  useEffect(() => {
    if (institute?.institute_id) {
      setSelectedInstitute(institute as any);
    }
  }, [institute?.institute_id]);

  // ─── Role Selection Handler ───────────────────────────────────────────────
  const handleSelect = async (role: Role): Promise<void> => {
    setSelectedId(role.role_id);
    setLoading(true);
    setError('');

    try {
      await finalizeContext({
        tenant_id: institute!.tenant_id,
        institute_id: institute!.institute_id,
        role_id: role.role_id,
      });

      setSelectedRole(role);
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
    } catch (err) {
      setError(mapError(err));
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout Handler ────────────────────────────────────────────────────────
  const handleLogout = async (): Promise<void> => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <AuthHeader userInitial={userInitial} onLogout={handleLogout} />

      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {hasMultiInstitute && (
          <View style={styles.backRow}>
            <TouchableOpacity
              style={[
                styles.backBtn,
                {
                  backgroundColor: colors.iconBtnBg,
                  borderColor: colors.iconBtnBorder,
                },
              ]}
              onPress={() => navigation.navigate('InstituteSelect')}
              activeOpacity={0.75}
            >
              <AppIcons.ArrowLeft
                size={16}
                color={colors.iconColor}
                strokeWidth={2}
              />
              <Text style={[styles.backLabel, { color: colors.iconColor }]}>
                {STRINGS.ROLE_CHANGE_INSTITUTE}
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

        <View style={styles.greeting}>
          <Text style={[styles.greetTitle, { color: colors.textPrimary }]}>
            {STRINGS.ROLE_SELECT_TITLE}
          </Text>
          <Text style={[styles.greetSub, { color: colors.textSecondary }]}>
            {STRINGS.ROLE_SELECT_SUBTITLE}
          </Text>
        </View>

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

        {roles.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No roles available for this institute.
          </Text>
        ) : (
          <View style={styles.list}>
            {roles.map(role => (
              <RoleCard
                key={role.role_id}
                role={role}
                isSelected={selectedId === role.role_id}
                onClick={loading ? () => {} : handleSelect}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <SupportFooter />
      <FullScreenLoader visible={loading} />
    </SafeAreaView>
  );
};

export default RoleSelectScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  contentWide: { maxWidth: 600, alignSelf: 'center', width: '100%' },
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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  errorText: { ...typography.body },
  list: { gap: spacing.sm },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    ...typography.body,
  },
});
