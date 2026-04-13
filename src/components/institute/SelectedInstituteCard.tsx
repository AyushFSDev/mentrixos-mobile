/**
 * @file SelectedInstituteCard.tsx
 * @module components/institute/SelectedInstituteCard
 * @description Read-only confirmation card shown after the user picks an institute.
 *
 * @prop {Institute} institute — Selected institute data object from the API.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppIcons from '../common/AppIcons';
import { radius } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';
import { Institute } from './InstituteCard';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SelectedInstituteCardProps {
  institute: Institute;
}

interface PaletteColors {
  background: string;
  border: string;
  name: string;
  location: string;
}

// ---------------------------------------------------------------------------
// Theme-specific color tokens
// ---------------------------------------------------------------------------
const LIGHT_COLORS: PaletteColors = {
  background: '#E0ECFF',
  border: '#9AA9BA',
  name: '#0d1b2a',
  location: '#6b7280',
};

const DARK_COLORS: PaletteColors = {
  background: '#2e2e2e',
  border: '#015fac',
  name: '#ffffff',
  location: '#9ca3af',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const SelectedInstituteCard: React.FC<SelectedInstituteCardProps> = ({ institute }) => {
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
        {institute.logo ? (
          <Image source={{ uri: institute.logo }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoFallback]}>
            <Text style={styles.logoInitial}>{initial}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={[styles.name, { color: palette.name }]}>
            {institute.name}
          </Text>

          {location ? (
            <View style={styles.locationRow}>
              <AppIcons.Location size={13} color={palette.location} strokeWidth={1.8} />
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
    marginBottom: spacing.xs / 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 1,
    marginTop: spacing.xs / 2,
  },
  location: {
    ...typography.cardSubtitle,
  },
  right: {
    flexShrink: 0,
  },
});