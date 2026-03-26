import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { useFocusEffect } from '@react-navigation/native';
import { assets } from '../../data/tradingAssets';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useCryptoPrices } from '../../context/CryptoPricesContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAccess } from '../../context/AccessContext';
import {
  formatCryptoQuantity,
  getCryptoQuantityForTicker,
} from '../../utils/portfolioHelpers';
import {
  type ChartPeriod,
  fetchAssetChartUsd,
  formatChangePercent,
  formatUsdPrice,
} from '../../services/coinGecko';

type Props = NativeStackScreenProps<RootStackParamList, 'Asset'>;

const CryptoAssetScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { getQuote } = useCryptoPrices();
  const { summary, refresh } = usePortfolio();
  const { canTransact } = useAccess();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const asset = useMemo(
    () => assets.find(a => a.id === id),
    [id],
  );

  const quote = asset ? getQuote(asset) : null;
  const heldAmount = asset
    ? getCryptoQuantityForTicker(summary, asset.fromTicker)
    : 0;
  const isPositive =
    quote?.change24hPercent != null
      ? quote.change24hPercent >= 0
      : asset?.change?.startsWith('+') ?? false;

  const chartWidth = 260;
  const chartHeight = 120;
  const [period, setPeriod] = useState<ChartPeriod>('7D');
  const [chartValues, setChartValues] = useState<number[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    if (!asset?.coingeckoId) return;
    let cancelled = false;
    const loadChart = async () => {
      try {
        setLoadingChart(true);
        setChartError(null);
        const values = await fetchAssetChartUsd(asset.coingeckoId!, period);
        if (cancelled) return;
        if (values.length > 1) {
          setChartValues(values);
        } else if (quote?.sparkline7d?.length) {
          setChartValues(quote.sparkline7d);
        } else {
          setChartValues([]);
        }
      } catch (e) {
        if (cancelled) return;
        setChartError(e instanceof Error ? e.message : 'Could not load chart');
        if (quote?.sparkline7d?.length) {
          setChartValues(quote.sparkline7d);
        } else {
          setChartValues([]);
        }
      } finally {
        if (!cancelled) setLoadingChart(false);
      }
    };
    loadChart();
    return () => {
      cancelled = true;
    };
  }, [asset?.coingeckoId, period, quote?.sparkline7d]);

  const chartPath = useMemo(() => {
    const values = chartValues.length > 1 ? chartValues : [];
    if (!values.length) return '';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return values
      .map((value, index) => {
        const x =
          values.length === 1
            ? chartWidth / 2
            : (chartWidth / (values.length - 1)) * index;
        const normalized = (value - min) / range;
        const y = chartHeight - normalized * chartHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [chartValues]);

  const chartIsPositive = useMemo(() => {
    if (chartValues.length > 1) {
      return chartValues[chartValues.length - 1] >= chartValues[0];
    }
    return isPositive;
  }, [chartValues, isPositive]);

  if (!asset) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>Asset not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{asset.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.assetRow}>
          <Image source={{ uri: asset.imageURL }} style={styles.assetImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <Text style={styles.assetPair}>{asset.toTicker} • Crypto</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.assetPrice}>
              {asset.toSymbol}
              {quote ? formatUsdPrice(quote.priceUsd) : asset.sellPrice}
            </Text>
            <Text
              style={[
                styles.assetChange,
                isPositive ? styles.positive : styles.negative,
              ]}
            >
              {quote?.change24hPercent != null
                ? formatChangePercent(quote.change24hPercent)
                : asset.change}
            </Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.periodToggleRow}>
              {(['24H', '7D', '30D'] as ChartPeriod[]).map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.periodToggle,
                    period === item && styles.periodToggleActive,
                  ]}
                  onPress={() => setPeriod(item)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.periodToggleText,
                      period === item && styles.periodToggleTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {loadingChart ? (
            <View style={styles.chartLoadingWrap}>
              <ActivityIndicator size="small" color="#9CA3AF" />
            </View>
          ) : null}
          <Svg width={chartWidth} height={chartHeight}>
            {chartPath ? (
              <>
                <Defs>
                  <LinearGradient
                    id="assetAreaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <Stop
                      offset="0%"
                      stopColor={chartIsPositive ? '#22C55E' : '#EF4444'}
                      stopOpacity={0.25}
                    />
                    <Stop
                      offset="100%"
                      stopColor={chartIsPositive ? '#22C55E' : '#EF4444'}
                      stopOpacity={0}
                    />
                  </LinearGradient>
                </Defs>
                <Path
                  d={`${chartPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                  fill="url(#assetAreaGradient)"
                  strokeWidth={0}
                />
                <Path
                  d={chartPath}
                  stroke={chartIsPositive ? '#22C55E' : '#EF4444'}
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            ) : null}
          </Svg>
          {chartError ? <Text style={styles.chartErrorText}>Chart fallback in use</Text> : null}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Market</Text>
            <Text style={styles.statValue}>{asset.toTicker}/USD</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>24h change</Text>
            <Text
              style={[
                styles.statValue,
                isPositive ? styles.positive : styles.negative,
              ]}
            >
              {quote?.change24hPercent != null
                ? formatChangePercent(quote.change24hPercent)
                : asset.change}
            </Text>
          </View>
        </View>

        {canTransact && heldAmount > 0 && quote ? (
          <View style={styles.demoHoldCard}>
            <Text style={styles.demoHoldLabel}>Your balance</Text>
            <Text style={styles.demoHoldMain}>
              {formatCryptoQuantity(asset.fromTicker, heldAmount)}{' '}
              {asset.fromTicker}
            </Text>
            <Text style={styles.demoHoldSub}>
              ≈ $
              {(heldAmount * quote.priceUsd).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              at current price
            </Text>
          </View>
        ) : canTransact ? (
          <View style={styles.demoHoldCardMuted}>
            <Text style={styles.demoHoldMutedText}>
              {"You don't hold this asset yet. Buy from Trade when execution is enabled; balances sync from your account wallet."}
            </Text>
          </View>
        ) : null}

        {canTransact ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.buyButton]}
              onPress={() =>
                navigation.navigate('Trade', { id: asset.id, side: 'buy' })
              }
            >
              <Text style={styles.actionButtonTextDark}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.sellButton]}
              onPress={() =>
                navigation.navigate('Trade', { id: asset.id, side: 'sell' })
              }
            >
              <Text style={styles.actionButtonTextDark}>Sell</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About {asset.name}</Text>
          <Text style={styles.infoText}>
            Price and 24h change are from CoinGecko (same source as your watchlist
            and trade screen). Chart shows live 7-day market sparkline data per
            asset.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#F9FAFB',
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  assetPair: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  assetPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  assetChange: {
    fontSize: 12,
    marginTop: 2,
  },
  positive: {
    color: '#22C55E',
  },
  negative: {
    color: '#EF4444',
  },
  chartCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    alignItems: 'center',
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  periodBadge: {
    fontSize: 11,
    color: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
  },
  periodToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  periodToggle: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
  },
  periodToggleActive: {
    backgroundColor: '#F5C451',
    borderColor: '#F5C451',
  },
  periodToggleText: {
    fontSize: 11,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  periodToggleTextActive: {
    color: '#111827',
  },
  chartLoadingWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  chartErrorText: {
    marginTop: 6,
    color: '#9CA3AF',
    fontSize: 11,
    alignSelf: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.9)',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  demoHoldCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(245, 196, 81, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 196, 81, 0.35)',
  },
  demoHoldCardMuted: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  demoHoldLabel: {
    fontSize: 11,
    color: '#F5C451',
    fontWeight: '600',
    marginBottom: 4,
  },
  demoHoldMain: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  demoHoldSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  demoHoldMutedText: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    backgroundColor: '#22C55E',
  },
  sellButton: {
    backgroundColor: '#F97316',
  },
  actionButtonTextDark: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B1120',
  },
  infoCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.9)',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
});

export default CryptoAssetScreen;

