import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '@/src/constants/theme';
import type { FundNav } from '@/src/types/fund';

interface NavHistoryChartProps {
  data: FundNav[];
}

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - spacing.lg * 2 - spacing.lg * 2;
const chartHeight = 150;

export function NavHistoryChart({ data }: NavHistoryChartProps) {
  // Take last 30 data points for chart
  const chartData = data.slice(0, 30).reverse();

  if (chartData.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Not enough data for chart</Text>
      </View>
    );
  }

  const navValues = chartData.map((d) => parseFloat(d.nav));
  const minNav = Math.min(...navValues);
  const maxNav = Math.max(...navValues);
  const range = maxNav - minNav || 1;

  // Calculate points for the line
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - ((parseFloat(d.nav) - minNav) / range) * chartHeight;
    return { x, y };
  });

  // Create SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Calculate trend
  const firstNav = navValues[0];
  const lastNav = navValues[navValues.length - 1];
  const trend = lastNav - firstNav;
  const trendColor = trend >= 0 ? colors.positive : colors.negative;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NAV History (30 days)</Text>
        <Text style={[styles.trend, { color: trendColor }]}>
          {trend >= 0 ? '+' : ''}
          {trend.toFixed(2)} ({((trend / firstNav) * 100).toFixed(2)}%)
        </Text>
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.yAxisLabels}>
          <Text style={styles.axisLabel}>{maxNav.toFixed(2)}</Text>
          <Text style={styles.axisLabel}>{minNav.toFixed(2)}</Text>
        </View>
        <View style={styles.chart}>
          {/* Simple line chart using absolute positioning */}
          {points.map((point, i) => {
            if (i === 0) return null;
            const prevPoint = points[i - 1];
            const lineLength = Math.sqrt(
              Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
            );
            const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
            return (
              <View
                key={i}
                style={[
                  styles.line,
                  {
                    left: prevPoint.x,
                    top: prevPoint.y,
                    width: lineLength,
                    transform: [{ rotate: `${angle}rad` }],
                    backgroundColor: trendColor,
                  },
                ]}
              />
            );
          })}
          {/* Data points */}
          {points.map((point, i) => (
            <View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  left: point.x - 3,
                  top: point.y - 3,
                  backgroundColor: trendColor,
                },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.xAxisLabels}>
        <Text style={styles.axisLabel}>{chartData[0]?.date}</Text>
        <Text style={styles.axisLabel}>{chartData[chartData.length - 1]?.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  trend: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    height: chartHeight,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    marginRight: spacing.sm,
    width: 50,
  },
  chart: {
    flex: 1,
    height: chartHeight,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    height: 2,
    transformOrigin: 'left center',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingLeft: 58,
  },
  axisLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  noDataText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
