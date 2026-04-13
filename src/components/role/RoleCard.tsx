/**
 * @file RoleCard.tsx
 * @module components/role/RoleCard
 * @description Tappable card representing a single user role in the role-selection list.
 *
 * @prop {Role}     role       — Role data object from the API.
 * @prop {function} onClick    — Called with the role object when the card is tapped.
 * @prop {boolean}  isSelected — Applies the selected border style. Default: false
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppIcons from '../common/AppIcons';
import RoleIcon from '../common/RoleIcon';
import { radius, shadows } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Role {
  // New API shape
  name?: string;
  icon_name?: string;
  icon_color?: string;
  description?: string;
  // Old API shape
  role_name?: string;
  role_icon?: string;
  role_icon_color?: string;
  role_description?: string;
  // Aliases
  icon?: string;
  desc?: string;
  [key: string]: unknown;
}

interface RoleCardProps {
  role: Role;
  onClick: (role: Role) => void;
  isSelected?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SELECTED_BORDER_COLOR = '#2563eb';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const RoleCard: React.FC<RoleCardProps> = ({ role, onClick, isSelected = false }) => {
  const { colors } = useTheme();

  const iconName = role.role_icon ?? role.icon_name ?? role.icon ?? 'person';
  const iconColor =
    role.role_icon_color ??
    role.icon_color ??
    SELECTED_BORDER_COLOR;
  const displayName = role.role_name ?? role.name ?? '';
  const description = role.role_description ?? role.description ?? role.desc ?? '';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isSelected ? SELECTED_BORDER_COLOR : colors.border,
          borderWidth: isSelected ? 2 : 1.5,
        },
        shadows.card,
      ]}
      onPress={() => onClick(role)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={displayName}
      accessibilityState={{ selected: isSelected }}
    >
      <View style={styles.row}>
        {/* ── Icon ─────────────────────────────────────────────────────────── */}
        <View style={styles.iconBox}>
          <RoleIcon name={iconName} color={iconColor} size={26} />
        </View>

        {/* ── Role name + optional description ─────────────────────────────── */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {displayName}
          </Text>
          {description ? (
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {description}
            </Text>
          ) : null}
        </View>

        {/* ── Arrow box ────────────────────────────────────────────────────── */}
        <View
          style={[
            styles.arrowBox,
            { borderColor: isSelected ? SELECTED_BORDER_COLOR : colors.border },
          ]}
        >
          <AppIcons.ChevronRight size={20} color={colors.textMuted} strokeWidth={2} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RoleCard;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    ...typography.cardTitle,
    marginBottom: spacing.xs / 2,
  },
  description: {
    ...typography.cardSubtitle,
    lineHeight: 18,
  },
  arrowBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});