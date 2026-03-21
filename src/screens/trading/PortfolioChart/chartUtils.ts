import type { ChartData, ChartDataPoint } from './data/chart';

export type DataRanges = {
  minValue: number;
  maxValue: number;
  valueRange: number;
  paddedMinValue: number;
  paddedValueRange: number;
  minTime: number;
  maxTime: number;
  timeRange: number;
};

export type CoordinateTransform = {
  timeToX: (timestamp: number) => number;
  valueToY: (value: number) => number;
};

export const createCoordinateTransform = (
  minTime: number,
  timeRange: number,
  minValue: number,
  valueRange: number,
  width: number,
  height: number,
): CoordinateTransform => {
  const timeToX = (timestamp: number): number =>
    ((timestamp - minTime) / timeRange) * width;
  const valueToY = (value: number): number =>
    (1 - (value - minValue) / valueRange) * height;
  return { timeToX, valueToY };
};

export const bezierPoint = (
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
): { x: number; y: number } => {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
};

export const createPath = (
  points: readonly ChartDataPoint[],
  width: number,
  height: number,
  ranges: DataRanges,
): string => {
  if (points.length === 0) return '';

  const { timeToX, valueToY } = createCoordinateTransform(
    ranges.minTime,
    ranges.timeRange,
    ranges.paddedMinValue,
    ranges.paddedValueRange,
    width,
    height,
  );

  const firstPoint = points[0];
  let path = `M ${timeToX(firstPoint.timestamp)} ${valueToY(firstPoint.value)}`;

  for (let i = 1; i < points.length; i++) {
    const current = points[i - 1];
    const next = points[i];
    const afterNext = points[i + 1] ?? next;

    const currentX = timeToX(current.timestamp);
    const nextX = timeToX(next.timestamp);
    const afterNextX = timeToX(afterNext.timestamp);

    const cp1x = currentX + (nextX - currentX) * 0.5;
    const cp1y = valueToY(current.value);
    const cp2x = nextX - (afterNextX - nextX) * 0.5;
    const cp2y = valueToY(next.value);

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nextX} ${valueToY(
      next.value,
    )}`;
  }

  return path;
};

export const createAreaPath = (
  points: readonly ChartDataPoint[],
  width: number,
  height: number,
  ranges: DataRanges,
): string => {
  const linePath = createPath(points, width, height, ranges);
  const { timeToX } = createCoordinateTransform(
    ranges.minTime,
    ranges.timeRange,
    ranges.paddedMinValue,
    ranges.paddedValueRange,
    width,
    height,
  );
  const firstX = timeToX(points[0].timestamp);
  const lastX = timeToX(points[points.length - 1].timestamp);
  return `${linePath} L ${lastX} ${height} L ${firstX} ${height} Z`;
};

export const formatDateLabel = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short' });
};

export const buildDataRanges = (data: ChartData): DataRanges => {
  const minValue = Math.min(...data.map(p => p.value));
  const maxValue = Math.max(...data.map(p => p.value));
  const valueRange = maxValue - minValue || 1;
  const padding = valueRange * 0.1;
  const minTime = Math.min(...data.map(p => p.timestamp));
  const maxTime = Math.max(...data.map(p => p.timestamp));
  const timeRange = maxTime - minTime || 1;

  return {
    minValue,
    maxValue,
    valueRange,
    paddedMinValue: minValue - padding,
    paddedValueRange: maxValue + padding - (minValue - padding),
    minTime,
    maxTime,
    timeRange,
  };
};

export const sampleBezierPath = (
  data: ChartData,
  ranges: DataRanges,
  width: number,
  height: number,
): Array<{ x: number; y: number }> => {
  if (width === 0 || data.length === 0) return [];

  const { timeToX, valueToY } = createCoordinateTransform(
    ranges.minTime,
    ranges.timeRange,
    ranges.paddedMinValue,
    ranges.paddedValueRange,
    width,
    height,
  );

  if (data.length === 1) {
    const p = data[0];
    return [{ x: timeToX(p.timestamp), y: valueToY(p.value) }];
  }

  const points: Array<{ x: number; y: number }> = [];
  const SAMPLES_PER_SEGMENT = 30;

  for (let i = 0; i < data.length - 1; i++) {
    const start = data[i];
    const end = data[i + 1];
    const afterNext = data[i + 2] ?? end;

    const startX = timeToX(start.timestamp);
    const endX = timeToX(end.timestamp);
    const afterNextX = timeToX(afterNext.timestamp);
    const startY = valueToY(start.value);
    const endY = valueToY(end.value);

    const p0 = { x: startX, y: startY };
    const p1 = { x: startX + (endX - startX) * 0.5, y: startY };
    const p2 = { x: endX - (afterNextX - endX) * 0.5, y: endY };
    const p3 = { x: endX, y: endY };

    for (let j = 0; j <= SAMPLES_PER_SEGMENT; j++) {
      points.push(bezierPoint(j / SAMPLES_PER_SEGMENT, p0, p1, p2, p3));
    }
  }

  return points;
};

export const findClosestPointOnTimeAxis = (
  data: ChartData,
  ranges: DataRanges,
  x: number,
  width: number,
  height: number,
): { point: ChartDataPoint; index: number; x: number; y: number } | null => {
  if (width === 0 || data.length === 0) return null;

  const { timeToX, valueToY } = createCoordinateTransform(
    ranges.minTime,
    ranges.timeRange,
    ranges.paddedMinValue,
    ranges.paddedValueRange,
    width,
    height,
  );

  const normalizedX = Math.max(0, Math.min(1, x / width));
  const targetTime = ranges.minTime + normalizedX * ranges.timeRange;

  let closestIndex = 0;
  let minDistance = Math.abs(data[0].timestamp - targetTime);

  for (let i = 1; i < data.length; i++) {
    const distance = Math.abs(data[i].timestamp - targetTime);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  const point = data[closestIndex];
  return {
    point,
    index: closestIndex,
    x: timeToX(point.timestamp),
    y: valueToY(point.value),
  };
};

export const clampX = (x: number, maxWidth: number): number => {
  'worklet';
  return Math.max(0, Math.min(x, maxWidth));
};

