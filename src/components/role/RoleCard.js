/**
 * @file RoleCard.js
 * @module components/role/RoleCard
 * @description Tappable card representing a single user role in the role-selection list.
 *
 * Design rules:
 *   - Selected state  : Blue border only — background/surface color does NOT change.
 *   - Icon bubble     : No background fill — icon renders directly on the card surface.
 *   - Icons           : Resolved via RoleIcon (MaterialIcons / MaterialCommunityIcons).
 *
 * Field resolution supports both old and new API response shapes so the card
 * works without a migration if the backend contract changes.
 *
 * @prop {object}   role       — Role data object from the API.
 * @prop {function} onClick    — Called with the role object when the card is tapped.
 * @prop {boolean}  isSelected — Applies the selected border style. Default: false
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppIcons from '../common/AppIcons';
import RoleIcon from '../ui/RoleIcon';
import { radius, shadows } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';

// Blue used for the selected border and the arrow box border.
const SELECTED_BORDER_COLOR = '#2563eb';

const RoleCard = ({ role, onClick, isSelected }) => {
  const { colors } = useTheme();

  // ---------------------------------------------------------------------------
  // Field resolution
  // Supports both the old API shape (role_icon, role_name, …) and the new shape
  // (icon_name, name, …) so the card works during a backend migration period.
  // ---------------------------------------------------------------------------
  const iconName = role.role_icon ?? role.icon_name ?? role.icon ?? 'person';
  const iconColor =
    role.role_icon_color ??
    role.icon_color ??
    colors.primary ??
    SELECTED_BORDER_COLOR;
  const displayName = role.role_name ?? role.name ?? '';
  const description =
    role.role_description ?? role.description ?? role.desc ?? '';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          // Selected: 2px blue border; unselected: 1.5px theme border.
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
        {/* ── Icon — no background fill, renders directly on the card ─────── */}
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

        {/* ── Arrow box — border turns blue when selected ───────────────────── */}
        <View
          style={[
            styles.arrowBox,
            { borderColor: isSelected ? SELECTED_BORDER_COLOR : colors.border },
          ]}
        >
          <AppIcons.ChevronRight
            size={20}
            color={colors.textMuted}
            strokeWidth={2}
          />
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
  // Icon container — intentionally has no backgroundColor per design spec.
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
    marginBottom: 2,
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
