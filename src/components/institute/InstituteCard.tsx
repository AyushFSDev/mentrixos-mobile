/**
 * @file InstituteCard.tsx
 * @module components/institute/InstituteCard
 * @description Tappable card representing a single institute in the search list.
 *
 * @prop {Institute} institute   — Institute data object from the API.
 * @prop {function}  onClick     — Called with the institute object when tapped.
 * @prop {boolean}   disabled    — Prevents interaction and dims the card. Default: false
 * @prop {string[]}  searchWords — Array of search terms; the first entry is used for highlighting.
 */

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppIcons from '../common/AppIcons';
import { radius, shadows } from '../../theme/globalStyles';
import typography from '../../theme/typography';
import spacing from '../../theme/spacing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Institute {
  name?: string;
  city?: string;
  state?: string;
  logo?: string;
  type?: string;
  [key: string]: unknown;
}

interface HighlightTextProps {
  text?: string;
  searchWord?: string;
  style?: TextStyle | TextStyle[];
  highlightStyle?: TextStyle;
}

interface InstituteCardProps {
  institute: Institute;
  onClick: (institute: Institute) => void;
  disabled?: boolean;
  searchWords?: string[];
}

// ---------------------------------------------------------------------------
// HighlightText
// ---------------------------------------------------------------------------
const HighlightText: React.FC<HighlightTextProps> = ({
  text = '',
  searchWord = '',
  style,
  highlightStyle,
}) => {
  if (!searchWord.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  const escapedWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedWord})`, 'gi');
  const parts = text.split(regex);

  return (
    <Text style={style}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={[style, highlightStyle]}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
};

// ---------------------------------------------------------------------------
// InstituteCard
// ---------------------------------------------------------------------------
const InstituteCard: React.FC<InstituteCardProps> = ({
  institute,
  onClick,
  disabled = false,
  searchWords = [],
}) => {
  const { colors } = useTheme();

  const [logoError, setLogoError] = useState<boolean>(false);

  const location = [institute.city, institute.state].filter(Boolean).join(', ');
  const searchWord = searchWords[0] ?? '';
  const initial = institute.name?.[0]?.toUpperCase() ?? 'I';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: disabled ? 0.6 : 1,
        },
        shadows.card,
      ]}
      onPress={() => !disabled && onClick(institute)}
      activeOpacity={0.75}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={institute.name}
      accessibilityState={{ disabled }}
    >
      {/* ── Left section: logo + name + location ─────────────────────────── */}
      <View style={styles.left}>
        <View style={[styles.logoBox, { backgroundColor: colors.inputBg }]}>
          {institute.logo && !logoError ? (
            <Image
              source={{ uri: institute.logo }}
              style={styles.logoImage}
              onError={() => setLogoError(true)}
            />
          ) : (
            <Text style={[styles.logoInitial, { color: colors.textSecondary }]}>
              {initial}
            </Text>
          )}
        </View>

        <View style={styles.info}>
          <HighlightText
            text={institute.name ?? ''}
            searchWord={searchWord}
            style={[styles.name, { color: colors.textPrimary }]}
            highlightStyle={styles.highlight}
          />
          {location ? (
            <View style={styles.locationRow}>
              <AppIcons.Location size={13} color={colors.textMuted} strokeWidth={1.8} />
              <HighlightText
                text={location}
                searchWord={searchWord}
                style={[styles.location, { color: colors.textSecondary }]}
                highlightStyle={styles.highlight}
              />
            </View>
          ) : null}
        </View>
      </View>

      {/* ── Right section: institute type + chevron ───────────────────────── */}
      <View style={styles.right}>
        <Text style={[styles.type, { color: colors.textMuted }]}>
          {institute.type ?? 'School'}
        </Text>
        <View
          style={[
            styles.arrowBox,
            { backgroundColor: colors.inputBg, borderColor: colors.border },
          ]}
        >
          <AppIcons.ChevronRight size={20} color={colors.textPrimary} strokeWidth={2} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InstituteCard;

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
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoInitial: {
    ...typography.cardTitle,
    fontSize: 18,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 0,
  },
  type: {
    ...typography.label,
    fontSize: 13,
  },
  arrowBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight: {
    backgroundColor: '#fef08a',
    color: '#854d0e',
    borderRadius: spacing.xs - 1,
  },
});