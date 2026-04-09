import React, { useState, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAllFunds, useSearchFunds } from '@/src/hooks/useFunds';
import {
  FundCard,
  SearchBar,
  LoadingSpinner,
  ErrorView,
  EmptyState,
} from '@/src/components';
import { colors, spacing } from '@/src/constants/theme';
import type { Fund } from '@/src/types/fund';
import type { RootStackParamList } from '@/src/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function FundListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: allFunds, isLoading, isError, refetch } = useAllFunds();
  const { data: searchResults, isLoading: isSearching } = useSearchFunds(searchQuery);

  const displayData = useMemo(() => {
    if (searchQuery.length >= 2 && searchResults) {
      return searchResults;
    }
    if (searchQuery.length >= 2 && allFunds) {
      // Client-side filter as fallback
      const query = searchQuery.toLowerCase();
      return allFunds.filter((fund) =>
        fund.schemeName.toLowerCase().includes(query)
      );
    }
    // Show first 100 funds by default for performance
    return allFunds?.slice(0, 100) ?? [];
  }, [allFunds, searchResults, searchQuery]);

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

  if (isLoading) {
    return <LoadingSpinner message="Loading funds..." />;
  }

  if (isError) {
    return (
      <ErrorView
        message="Failed to load funds. Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by fund name..."
      />
      {isSearching && searchQuery.length >= 2 ? (
        <LoadingSpinner message="Searching..." />
      ) : displayData.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No funds found"
          message={
            searchQuery
              ? 'Try a different search term'
              : 'No mutual funds available'
          }
        />
      ) : (
        <FlatList
          data={displayData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
});
