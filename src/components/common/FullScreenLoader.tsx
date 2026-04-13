import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import spacing from '../../theme/spacing';
import { radius } from '../../theme/globalStyles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface FullScreenLoaderProps {
  visible: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ visible }) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.accentBlue} />
      </View>
    </View>
  );
};

export default FullScreenLoader;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
});