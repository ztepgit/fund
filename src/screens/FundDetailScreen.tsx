import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFundDetail } from '@/src/hooks/useFunds';
import { useFavoritesStore } from '@/src/store/favoritesStore';
import { LoadingSpinner, ErrorView, NavHistoryChart } from '@/src/components';
import { colors, spacing, fontSize, borderRadius } from '@/src/constants/theme';
import type { RootStackParamList } from '@/src/navigation/types';

type FundDetailRouteProp = RouteProp<RootStackParamList, 'FundDetail'>;

export function FundDetailScreen() {
  const route = useRoute<FundDetailRouteProp>();
  const navigation = useNavigation();
  const { schemeCode, schemeName } = route.params;

  const { data: fundDetail, isLoading, isError, refetch } = useFundDetail(schemeCode);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const favorited = isFavorite(schemeCode);

  const handleToggleFavorite = () => {
    toggleFavorite({ schemeCode, schemeName });
  };

  // Set header right button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleToggleFavorite} style={styles.headerButton}>
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={24}
            color={favorited ? colors.favorite : colors.text}
          />
        </Pressable>
      ),
    });
  }, [navigation, favorited]);

  if (isLoading) {
    return <LoadingSpinner message="Loading fund details..." />;
  }

  if (isError || !fundDetail) {
    return (
      <ErrorView
        message="Failed to load fund details"
        onRetry={refetch}
      />
    );
  }

  const { meta, data } = fundDetail;
  const latestNav = data[0];
  const previousNav = data[1];
  const navChange = latestNav && previousNav
    ? parseFloat(latestNav.nav) - parseFloat(previousNav.nav)
    : 0;
  const navChangePercent = previousNav
    ? (navChange / parseFloat(previousNav.nav)) * 100
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.fundHouse}>{meta.fund_house}</Text>
        <Text style={styles.schemeName}>{meta.scheme_name}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{meta.scheme_type}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{meta.scheme_category}</Text>
          </View>
        </View>
      </View>

      {/* NAV Card */}
      {latestNav && (
        <View style={styles.navCard}>
          <Text style={styles.navLabel}>Current NAV</Text>
          <View style={styles.navRow}>
            <Text style={styles.navValue}>{parseFloat(latestNav.nav).toFixed(4)}</Text>
            <View
              style={[
                styles.changeContainer,
                { backgroundColor: navChange >= 0 ? colors.positive + '20' : colors.negative + '20' },
              ]}
            >
              <Ionicons
                name={navChange >= 0 ? 'trending-up' : 'trending-down'}
                size={16}
                color={navChange >= 0 ? colors.positive : colors.negative}
              />
              <Text
                style={[
                  styles.changeText,
                  { color: navChange >= 0 ? colors.positive : colors.negative },
                ]}
              >
                {navChange >= 0 ? '+' : ''}
                {navChange.toFixed(4)} ({navChangePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
          <Text style={styles.navDate}>As of {latestNav.date}</Text>
        </View>
      )}

      {/* Chart */}
      {data.length > 1 && <NavHistoryChart data={data} />}

      {/* Fund Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fund Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Scheme Code</Text>
          <Text style={styles.infoValue}>{meta.scheme_code}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fund House</Text>
          <Text style={styles.infoValue}>{meta.fund_house}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type</Text>
          <Text style={styles.infoValue}>{meta.scheme_type}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Category</Text>
          <Text style={styles.infoValue}>{meta.scheme_category}</Text>
        </View>
      </View>

      {/* Recent NAV History */}
      <View style={styles.historyCard}>
        <Text style={styles.infoTitle}>Recent NAV History</Text>
        {data.slice(0, 10).map((nav, index) => (
          <View key={index} style={styles.historyRow}>
            <Text style={styles.historyDate}>{nav.date}</Text>
            <Text style={styles.historyNav}>{parseFloat(nav.nav).toFixed(4)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: spacing.sm,
  },
  headerCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  fundHouse: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  schemeName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 26,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '500',
  },
  navCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  navLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  navValue: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.text,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  changeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  navDate: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  historyCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  historyNav: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
