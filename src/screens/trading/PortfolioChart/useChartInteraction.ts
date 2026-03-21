import { useCallback, useMemo, useRef, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { ChartData } from './data/chart';
import {
  clampX,
  findClosestPointOnTimeAxis,
  sampleBezierPath,
  type DataRanges,
} from './chartUtils';

type UseChartInteractionProps = {
  data: ChartData;
  height: number;
  chartWidth: number;
  chartWidthSV: SharedValue<number>;
  ranges: DataRanges;
  onValueChange?: (change: {
    value: number;
    change: number;
    changePercentage: number;
    point: ChartData[number];
  }) => void;
  onDismiss?: () => void;
};

const ANIMATION_DURATION_DRAG = 150;
const ANIMATION_DURATION_OPACITY = 200;
const AUTO_HIDE_TIMEOUT = 2000;

export const useChartInteraction = ({
  data,
  height,
  chartWidth,
  chartWidthSV,
  ranges,
  onValueChange,
  onDismiss,
}: UseChartInteractionProps) => {
  const indicatorX = useSharedValue<number | null>(null);
  const indicatorY = useSharedValue<number | null>(null);
  const indicatorOpacity = useSharedValue(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [indicatorState, setIndicatorState] = useState<{
    x: number | null;
    y: number | null;
    opacity: number;
  }>({ x: null, y: null, opacity: 0 });

  const sampledPath = useMemo(
    () => sampleBezierPath(data, ranges, chartWidth, height),
    [data, chartWidth, height, ranges],
  );

  useDerivedValue(() => {
    'worklet';
    if (indicatorX.value === null || sampledPath.length === 0) return;

    const x = indicatorX.value;
    let closestIndex = 0;
    let minDistance = Math.abs(sampledPath[0].x - x);

    for (let i = 1; i < sampledPath.length; i++) {
      const distance = Math.abs(sampledPath[i].x - x);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    indicatorY.value = sampledPath[closestIndex].y;
  });

  const hideIndicator = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    indicatorOpacity.value = withTiming(
      0,
      { duration: ANIMATION_DURATION_OPACITY },
      () => {
        indicatorX.value = null;
        indicatorY.value = null;
      },
    );
    onDismiss?.();
  }, [indicatorOpacity, indicatorX, indicatorY, onDismiss]);

  const updateIndicator = useCallback(
    (touchX: number) => {
      const width = chartWidthSV.value;
      if (width === 0) return;

      const result = findClosestPointOnTimeAxis(
        data,
        ranges,
        touchX,
        width,
        height,
      );
      if (!result) return;

      const isVisible = indicatorX.value !== null;
      const duration = isVisible
        ? ANIMATION_DURATION_DRAG
        : ANIMATION_DURATION_OPACITY;

      if (isVisible) {
        indicatorX.value = withTiming(result.x, { duration });
      } else {
        indicatorX.value = result.x;
        indicatorY.value = result.y;
      }
      indicatorOpacity.value = withTiming(1, { duration });

      const selectedValue = result.point.value;
      const previousValue =
        result.index > 0 ? data[result.index - 1].value : null;
      const change = previousValue ? selectedValue - previousValue : 0;
      const changePercentage =
        previousValue && previousValue !== 0
          ? (change / previousValue) * 100
          : 0;

      onValueChange?.({
        value: selectedValue,
        change,
        changePercentage,
        point: result.point,
      });

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(hideIndicator, AUTO_HIDE_TIMEOUT);
    },
    [
      chartWidthSV,
      data,
      ranges,
      height,
      indicatorX,
      indicatorY,
      indicatorOpacity,
      onValueChange,
      hideIndicator,
    ],
  );

  useAnimatedReaction(
    () => ({
      x: indicatorX.value,
      y: indicatorY.value,
      opacity: indicatorOpacity.value,
    }),
    current => {
      runOnJS(setIndicatorState)({
        x: current.x,
        y: current.y,
        opacity: current.opacity,
      });
    },
  );

  const handleGesture = useCallback(
    (x: number) => {
      const width = chartWidthSV.value;
      if (width > 0) {
        updateIndicator(clampX(x, width));
      }
    },
    [chartWidthSV, updateIndicator],
  );

  const gesture = Gesture.Simultaneous(
    Gesture.Tap().onEnd(event => {
      'worklet';
      runOnJS(handleGesture)(event.x);
    }),
    Gesture.Pan()
      .onStart(event => {
        'worklet';
        runOnJS(handleGesture)(event.x);
      })
      .onUpdate(event => {
        'worklet';
        runOnJS(handleGesture)(event.x);
      }),
  );

  return {
    gesture,
    indicatorState,
    dismiss: hideIndicator,
  };
};

