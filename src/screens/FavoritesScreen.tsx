import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { FundCard, EmptyState } from '@/src/components';
import { colors, spacing } from '@/src/constants/theme';
import type { Fund } from '@/src/types/fund';
import type { RootStackParamList } from '@/src/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const favorites = useFavoritesStore((state) => state.favorites);

  const handleFundPress = useCallback(
    (fund: Fund) => {
      navigation.navigate('FundDetail', { schemeCode: fund.schemeCode, schemeName: fund.schemeName });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Fund }) => (
      <FundCard fund={item} onPress={() => handleFundPress(item)} />
    ),
    [handleFundPress]
  );

  const keyExtractor = useCallback(
    (item: Fund) => item.schemeCode.toString(),
    []
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          message="Tap the heart icon on any fund to add it to your favorites"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});
