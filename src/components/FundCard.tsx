import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '@/src/constants/theme';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import type { Fund } from '@/src/types/fund';

interface FundCardProps {
  fund: Fund;
  onPress: () => void;
}

export function FundCard({ fund, onPress }: FundCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(fund.schemeCode);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(fund);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.schemeCode}>#{fund.schemeCode}</Text>
        <Text style={styles.schemeName} numberOfLines={2}>
          {fund.schemeName}
        </Text>
      </View>
      <Pressable
        onPress={handleFavoritePress}
        style={styles.favoriteButton}
        hitSlop={8}
      >
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={24}
          color={favorited ? colors.favorite : colors.textMuted}
        />
      </Pressable>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginRight: spacing.md,
  },
  schemeCode: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  schemeName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
  },
  favoriteButton: {
    padding: spacing.sm,
  },
});
