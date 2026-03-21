import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PortfolioChart, type PortfolioChartRef, type PortfolioChartValueChange } from './PortfolioChart';
import { portfolioChartData } from './PortfolioChart/data/chart';

type PortfolioData = {
  value: string;
  change: string;
  changePercentage: string;
  isPositive: boolean;
};

const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatChange = (change: number): string =>
  `${change >= 0 ? '+' : ''}${formatCurrency(change)}`;

const formatPercentage = (percentage: number): string =>
  `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}`;

const getInitialPortfolioData = (): PortfolioData => {
  const currentValue = portfolioChartData[portfolioChartData.length - 1].value;
  const initialValue = portfolioChartData[0].value;
  const change = currentValue - initialValue;
  const changePercentage = (change / initialValue) * 100;

  return {
    value: formatCurrency(currentValue),
    change: formatChange(change),
    changePercentage: formatPercentage(changePercentage),
    isPositive: change >= 0,
  };
};

const PortfolioHeader: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(
    getInitialPortfolioData(),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const chartRef = useRef<PortfolioChartRef>(null);

  const handleChartValueChange = useCallback(
    (change: PortfolioChartValueChange) => {
      const isPositive = change.change >= 0;
      setPortfolioData({
        value: formatCurrency(change.value),
        change: formatChange(change.change),
        changePercentage: formatPercentage(change.changePercentage),
        isPositive,
      });
      setSelectedDate(formatDate(change.point.timestamp));
    },
    [],
  );

  const handleDismiss = useCallback(() => {
    setPortfolioData(getInitialPortfolioData());
    setSelectedDate(null);
  }, []);

  const handlePressOutside = useCallback(() => {
    chartRef.current?.dismiss();
  }, []);

  const changeColor = portfolioData.isPositive ? '#22C55E' : '#EF4444';
  const pillBackground = portfolioData.isPositive ? '#065F4622' : '#7F1D1D22';

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handlePressOutside} activeOpacity={0.9}>
        <Text style={styles.label}>
          {selectedDate ? `Balance as of ${selectedDate}` : 'Total balance'}
        </Text>
        <Text style={styles.value}>{portfolioData.value}</Text>
        <View style={styles.changeRow}>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {portfolioData.change}
          </Text>
          <View style={[styles.pill, { backgroundColor: pillBackground }]}>
            <Text style={[styles.pillText, { color: changeColor }]}>
              {portfolioData.changePercentage}%
            </Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <PortfolioChart
            ref={chartRef}
            data={portfolioChartData}
            height={120}
            onValueChange={handleChartValueChange}
            onDismiss={handleDismiss}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]}>
          <Text style={styles.buttonPrimaryText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]}>
          <Text style={styles.buttonPrimaryText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonGhost]}>
          <Text style={styles.buttonGhostText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#0B1120',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  label: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  changeText: {
    fontSize: 13,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#F5C451',
  },
  buttonPrimaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  buttonGhost: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
  },
  buttonGhostText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5E7EB',
  },
});

export default PortfolioHeader;

