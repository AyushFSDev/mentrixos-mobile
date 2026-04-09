/**
 * @file SelectedInstituteCard.js
 * @module components/institute/SelectedInstituteCard
 * @description Read-only confirmation card shown after the user picks an institute.
 *
 * Visually distinct from the search-list card:
 *   - Light mode: blue-tinted background (#E0ECFF) with a steel border (#9AA9BA)
 *   - Dark  mode: dark surface (#2e2e2e) with a blue border (#015fac)
 *   - Verified badge icon on the right instead of a chevron
 *
 * The card is non-interactive — it confirms the selection, not triggers it.
 *
 * @prop {object} institute — Selected institute data object from the API.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppIcons from '../common/AppIcons';
import { radius } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Theme-specific color tokens used only by this card.
// Kept inline since they are intentionally not part of the global theme —
// this card has a unique blue-tinted treatment.
// ---------------------------------------------------------------------------
const LIGHT_COLORS = {
  background: '#E0ECFF',
  border: '#9AA9BA',
  name: '#0d1b2a',
  location: '#6b7280',
};

const DARK_COLORS = {
  background: '#2e2e2e',
  border: '#015fac',
  name: '#ffffff',
  location: '#9ca3af',
};

const SelectedInstituteCard = ({ institute }) => {
  const { isDark } = useTheme();

  const palette = isDark ? DARK_COLORS : LIGHT_COLORS;
  const location = [institute.city, institute.state].filter(Boolean).join(', ');
  const initial = institute.name?.[0]?.toUpperCase() ?? 'I';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.background, borderColor: palette.border },
      ]}
    >
      {/* ── Left section: logo + name + location ─────────────────────────── */}
      <View style={styles.left}>
        {/* Logo with initials fallback when image URL is absent */}
        {institute.logo ? (
          <Image source={{ uri: institute.logo }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoFallback]}>
            <Text style={styles.logoInitial}>{initial}</Text>
          </View>
        )}

        <View style={styles.info}>
          {/* Institute name */}
          <Text style={[styles.name, { color: palette.name }]}>
            {institute.name}
          </Text>

          {/* Location row — only rendered when at least one field is present */}
          {location ? (
            <View style={styles.locationRow}>
              <AppIcons.Location
                size={13}
                color={palette.location}
                strokeWidth={1.8}
              />
              <Text style={[styles.location, { color: palette.location }]}>
                {location}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* ── Right section: verified badge ─────────────────────────────────── */}
      <View style={styles.right}>
        <AppIcons.Verified size={26} color="#0070e0" />
      </View>
    </View>
  );
};

export default SelectedInstituteCard;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  // Shared base style for both the Image and the fallback View.
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    resizeMode: 'cover',
  },
  logoFallback: {
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitial: {
    ...typography.cardTitle,
    fontSize: 18,
    color: '#64748b',
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.cardTitle,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  location: {
    ...typography.cardSubtitle,
  },
  right: {
    flexShrink: 0, // Prevents the badge from being clipped on narrow screens
  },
});
