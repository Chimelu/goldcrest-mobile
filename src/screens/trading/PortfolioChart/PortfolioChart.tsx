import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { LayoutChangeEvent, View, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import type { ChartData, ChartDataPoint } from './data/chart';
import {
  buildDataRanges,
  createAreaPath,
  createCoordinateTransform,
  createPath,
  formatDateLabel,
} from './chartUtils';
import { useChartInteraction } from './useChartInteraction';

export type PortfolioChartValueChange = {
  value: number;
  change: number;
  changePercentage: number;
  point: ChartDataPoint;
};

export type PortfolioChartRef = {
  dismiss: () => void;
};

export type PortfolioChartProps = {
  data: ChartData;
  height?: number;
  onValueChange?: (change: PortfolioChartValueChange) => void;
  onDismiss?: () => void;
};

const HORIZONTAL_PADDING = 40;
const LABEL_HEIGHT = 20;
const INDICATOR_SIZE = 12;

export const PortfolioChart = forwardRef<PortfolioChartRef, PortfolioChartProps>(
  ({ data, height = 120, onValueChange, onDismiss }, ref) => {
    const [chartWidth, setChartWidth] = useState(0);
    const chartWidthSV = useSharedValue(0);

    const dataRanges = useMemo(() => buildDataRanges(data), [data]);

    const { gesture, indicatorState, dismiss } = useChartInteraction({
      data,
      height,
      chartWidth,
      chartWidthSV,
      ranges: dataRanges,
      onValueChange,
      onDismiss,
    });

    useImperativeHandle(ref, () => ({
      dismiss,
    }));

    const linePath = useMemo(
      () =>
        chartWidth > 0
          ? createPath(data, chartWidth, height, dataRanges)
          : '',
      [data, chartWidth, height, dataRanges],
    );

    const areaPath = useMemo(
      () =>
        chartWidth > 0
          ? createAreaPath(data, chartWidth, height, dataRanges)
          : '',
      [data, chartWidth, height, dataRanges],
    );

    const labelPositions = useMemo(() => {
      if (chartWidth === 0 || data.length === 0) return [];

      const { timeToX } = createCoordinateTransform(
        dataRanges.minTime,
        dataRanges.timeRange,
        dataRanges.paddedMinValue,
        dataRanges.paddedValueRange,
        chartWidth,
        height,
      );

      const monthMap = new Map<string, ChartDataPoint>();
      for (const point of data) {
        const monthKey = formatDateLabel(point.timestamp);
        const existing = monthMap.get(monthKey);
        if (!existing || point.timestamp < existing.timestamp) {
          monthMap.set(monthKey, point);
        }
      }

      const uniqueMonths = Array.from(monthMap.values()).sort(
        (a, b) => a.timestamp - b.timestamp,
      );

      const positions: Array<{
        x: number;
        label: string;
        anchor: 'start' | 'middle' | 'end';
      }> = [];

      const firstMonth = formatDateLabel(data[0].timestamp);
      positions.push({
        x: timeToX(data[0].timestamp) + HORIZONTAL_PADDING,
        label: firstMonth,
        anchor: 'start',
      });

      const firstUniqueMonth = uniqueMonths[0];
      const startIndex =
        formatDateLabel(firstUniqueMonth.timestamp) === firstMonth ? 1 : 0;
      for (let i = startIndex; i < uniqueMonths.length; i++) {
        positions.push({
          x: timeToX(uniqueMonths[i].timestamp) + HORIZONTAL_PADDING,
          label: formatDateLabel(uniqueMonths[i].timestamp),
          anchor: 'middle',
        });
      }

      const lastMonth = formatDateLabel(data[data.length - 1].timestamp);
      const lastUniqueMonth = uniqueMonths[uniqueMonths.length - 1];
      if (formatDateLabel(lastUniqueMonth.timestamp) !== lastMonth) {
        positions.push({
          x: chartWidth + HORIZONTAL_PADDING,
          label: lastMonth,
          anchor: 'end',
        });
      }

      return positions.sort((a, b) => a.x - b.x);
    }, [data, chartWidth, height, dataRanges]);

    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width;
        setChartWidth(width);
        chartWidthSV.value = width;
      },
      [chartWidthSV],
    );

    const positiveColor = '#22C55E';
    const backgroundColor = '#020617';
    const axisColor = '#6B7280';

    return (
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
          <View
            style={[styles.chartContainer, { height: height + LABEL_HEIGHT }]}
            onLayout={handleLayout}
          >
            <Svg
              width={chartWidth ? chartWidth + HORIZONTAL_PADDING * 2 : '100%'}
              height={height + LABEL_HEIGHT}
              style={[styles.svg, { marginHorizontal: -HORIZONTAL_PADDING }]}
            >
              <Defs>
                <LinearGradient
                  id="chartGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor={positiveColor} stopOpacity={0.3} />
                  <Stop offset="100%" stopColor={positiveColor} stopOpacity={0} />
                </LinearGradient>
              </Defs>

              <Path
                d={areaPath}
                fill="url(#chartGradient)"
                strokeWidth={0}
                transform={`translate(${HORIZONTAL_PADDING}, 0)`}
              />

              <Path
                d={linePath}
                stroke={positiveColor}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(${HORIZONTAL_PADDING}, 0)`}
              />

              {labelPositions.map((label, index) => (
                <SvgText
                  key={`label-${index}`}
                  x={label.x}
                  y={height + LABEL_HEIGHT - 4}
                  fontSize={10}
                  fill={axisColor}
                  textAnchor={label.anchor}
                  fontFamily="System"
                >
                  {label.label}
                </SvgText>
              ))}

              {indicatorState.x !== null && (
                <Line
                  x1={indicatorState.x + HORIZONTAL_PADDING}
                  y1={0}
                  x2={indicatorState.x + HORIZONTAL_PADDING}
                  y2={height}
                  stroke={axisColor}
                  strokeWidth={1}
                  strokeDasharray="2,2"
                  opacity={indicatorState.opacity}
                />
              )}

              {indicatorState.x !== null && indicatorState.y !== null && (
                <Circle
                  cx={indicatorState.x + HORIZONTAL_PADDING}
                  cy={indicatorState.y}
                  r={INDICATOR_SIZE / 2}
                  fill={backgroundColor}
                  stroke={positiveColor}
                  strokeWidth={2.5}
                  opacity={indicatorState.opacity}
                />
              )}
            </Svg>
          </View>
        </GestureDetector>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartContainer: {
    width: '100%',
    overflow: 'visible',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
  },
});

export default PortfolioChart;

