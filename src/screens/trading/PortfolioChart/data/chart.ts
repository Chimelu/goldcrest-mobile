export type ChartDataPoint = {
  timestamp: number;
  value: number;
};

export type ChartData = readonly ChartDataPoint[];

export const portfolioChartData: ChartData = [
  { timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000, value: 11500.0 },
  { timestamp: Date.now() - 87 * 24 * 60 * 60 * 1000, value: 11521.2 },
  { timestamp: Date.now() - 84 * 24 * 60 * 60 * 1000, value: 11542.3 },
  { timestamp: Date.now() - 81 * 24 * 60 * 60 * 1000, value: 11535.5 },
  { timestamp: Date.now() - 78 * 24 * 60 * 60 * 1000, value: 11528.7 },
  { timestamp: Date.now() - 75 * 24 * 60 * 60 * 1000, value: 11546.5 },
  { timestamp: Date.now() - 72 * 24 * 60 * 60 * 1000, value: 11524.2 },
  { timestamp: Date.now() - 69 * 24 * 60 * 60 * 1000, value: 11551.6 },
  { timestamp: Date.now() - 66 * 24 * 60 * 60 * 1000, value: 11568.9 },
  { timestamp: Date.now() - 63 * 24 * 60 * 60 * 1000, value: 11557.7 },
  { timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000, value: 11622.4 },
  { timestamp: Date.now() - 57 * 24 * 60 * 60 * 1000, value: 11599.1 },
  { timestamp: Date.now() - 54 * 24 * 60 * 60 * 1000, value: 11565.8 },
  { timestamp: Date.now() - 51 * 24 * 60 * 60 * 1000, value: 11582.4 },
  { timestamp: Date.now() - 48 * 24 * 60 * 60 * 1000, value: 11649.3 },
  { timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000, value: 11606.5 },
  { timestamp: Date.now() - 42 * 24 * 60 * 60 * 1000, value: 11623.6 },
  { timestamp: Date.now() - 39 * 24 * 60 * 60 * 1000, value: 11675.4 },
  { timestamp: Date.now() - 36 * 24 * 60 * 60 * 1000, value: 11707.2 },
  { timestamp: Date.now() - 33 * 24 * 60 * 60 * 1000, value: 11725.9 },
  { timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, value: 11724.5 },
  { timestamp: Date.now() - 27 * 24 * 60 * 60 * 1000, value: 11711.7 },
  { timestamp: Date.now() - 24 * 24 * 60 * 60 * 1000, value: 11718.9 },
  { timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000, value: 11700.6 },
  { timestamp: Date.now() - 18 * 24 * 60 * 60 * 1000, value: 11722.3 },
  { timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, value: 11749.0 },
  { timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000, value: 11755.7 },
  { timestamp: Date.now() - 9 * 24 * 60 * 60 * 1000, value: 11776.9 },
  { timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000, value: 11798.2 },
  { timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, value: 11792.7 },
  { timestamp: Date.now(), value: 11787.21 },
];

