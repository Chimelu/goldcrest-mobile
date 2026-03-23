import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  LayoutChangeEvent,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { assets, AssetItem } from '../../data/tradingAssets';
import { portfolioChartData } from './PortfolioChart/data/chart';
import type { RootStackParamList } from '../../navigation';
import { useCryptoPrices } from '../../context/CryptoPricesContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAccess } from '../../context/AccessContext';
import {
  computePortfolioTotals,
  enrichHoldings,
  formatCryptoQuantity,
} from '../../utils/portfolioHelpers';
import { formatUsdPrice } from '../../services/coinGecko';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const TradingDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { getQuote, loading, error, quotesByAssetId } = useCryptoPrices();
  const { summary, loading: portfolioLoading, error: portfolioError, refresh } =
    usePortfolio();
  const { canTransact } = useAccess();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const cryptoAssets = useMemo(
    () => assets.filter(item => item.type === 'crypto'),
    [],
  );

  const enrichedHoldings = useMemo(
    () => (summary ? enrichHoldings(summary.holdings) : []),
    [summary],
  );

  const portfolioTotals = useMemo(() => {
    if (!summary) {
      return { cashUsd: 0, cryptoValueUsd: 0, totalUsd: 0 };
    }
    return computePortfolioTotals(
      summary.availableUsd,
      enrichedHoldings,
      getQuote,
    );
  }, [summary, enrichedHoldings, getQuote, quotesByAssetId]);

  const [chartWidth, setChartWidth] = useState(0);
  const chartHeight = 100;

  const chartPath = useMemo(() => {
    if (!chartWidth || portfolioChartData.length === 0) {
      return '';
    }

    const values = portfolioChartData.map(p => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return portfolioChartData
      .map((point, index) => {
        const x =
          portfolioChartData.length === 1
            ? chartWidth / 2
            : (chartWidth / (portfolioChartData.length - 1)) * index;
        const normalized = (point.value - min) / range;
        const y = chartHeight - normalized * chartHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [chartWidth]);

  const handleChartLayout = (event: LayoutChangeEvent) => {
    setChartWidth(event.nativeEvent.layout.width);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.welcomeLabel}>Welcome back,</Text>
          <Text style={styles.welcomeName}>Chimelu</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>CT</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {canTransact ? (
          <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Crypto portfolio</Text>
          <Text style={styles.totalLabel}>Total balance</Text>
          {portfolioLoading ? (
            <ActivityIndicator color="#F5C451" style={{ marginVertical: 8 }} />
          ) : (
            <>
              <Text style={styles.totalValue}>
                $
                {portfolioTotals.totalUsd.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text style={styles.portfolioBreakdown}>
                ${portfolioTotals.cashUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                cash + ${portfolioTotals.cryptoValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                in crypto
              </Text>
            </>
          )}
          {portfolioError ? (
            <Text style={styles.portfolioErrorText} numberOfLines={3}>
              {portfolioError}
            </Text>
          ) : null}
          {loading && (
            <Text style={styles.priceHint} numberOfLines={2}>
              Loading live prices from CoinGecko…
            </Text>
          )}
          {!loading && error && (
            <Text style={styles.priceHint} numberOfLines={2}>
              Could not refresh prices ({error}). Using fallback values.
            </Text>
          )}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionPrimary]}
              onPress={() => {
                const firstAsset = cryptoAssets[0];
                if (!firstAsset) return;
                navigation.navigate('Trade', { id: firstAsset.id, side: 'buy' });
              }}
            >
              <Text style={styles.actionPrimaryText}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionPrimary]}
              onPress={() => {
                const firstAsset = cryptoAssets[0];
                if (!firstAsset) return;
                navigation.navigate('Trade', { id: firstAsset.id, side: 'sell' });
              }}
            >
              <Text style={styles.actionPrimaryText}>Sell</Text>
            </TouchableOpacity>
            <View style={[styles.actionButton, styles.actionGhost]}>
              <Text style={styles.actionGhostText}>Send</Text>
            </View>
          </View>
          <View style={styles.svgContainer} onLayout={handleChartLayout}>
            {chartWidth > 0 && (
              <Svg width={chartWidth} height={chartHeight}>
                <Defs>
                  <LinearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <Stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                    <Stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </LinearGradient>
                </Defs>
                <Path
                  d={`${chartPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                  fill="url(#areaGradient)"
                  strokeWidth={0}
                />
                <Path
                  d={chartPath}
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
            )}
          </View>
          </View>
        ) : null}

        {canTransact ? (
          <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your holdings</Text>
          <Text style={styles.holdingsSub}>
            From your account wallet (open Trade once to create it if new).
          </Text>
          {!portfolioLoading && !portfolioError && enrichedHoldings.length === 0 ? (
            <Text style={styles.holdingsEmpty}>
              No crypto yet. Use Buy on an asset to trade when execution is live.
            </Text>
          ) : null}
          {enrichedHoldings.map(({ asset, amount }, index) => {
            const quote = getQuote(asset);
            const valueUsd = amount * quote.priceUsd;
            const changeLabel =
              quote.change24hPercent != null
                ? `${quote.change24hPercent >= 0 ? '+' : ''}${quote.change24hPercent.toFixed(2)}%`
                : asset.change;
            const isUp =
              quote.change24hPercent != null
                ? quote.change24hPercent >= 0
                : !asset.change.startsWith('-');
            const isLast = index === enrichedHoldings.length - 1;
            return (
              <TouchableOpacity
                key={asset.id}
                style={[styles.holdingRow, isLast && styles.holdingRowLast]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Asset', { id: asset.id })}
              >
                <View style={styles.rowLeft}>
                  <Image source={{ uri: asset.imageURL }} style={styles.rowImage} />
                  <View>
                    <Text style={styles.rowName}>{asset.name}</Text>
                    <Text style={styles.rowPair}>
                      {formatCryptoQuantity(asset.fromTicker, amount)} {asset.fromTicker}
                    </Text>
                  </View>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowPrice}>
                    $
                    {valueUsd.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                  <Text
                    style={[
                      styles.rowChange,
                      isUp ? styles.positive : styles.negative,
                    ]}
                  >
                    {changeLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crypto watchlist</Text>
          <FlatList
            data={cryptoAssets}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => <AssetRow item={item} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const AssetRow: React.FC<{ item: AssetItem }> = ({ item }) => {
  const navigation = useNavigation<Navigation>();
  const { getQuote } = useCryptoPrices();
  const quote = getQuote(item);
  const changeLabel =
    quote.change24hPercent != null
      ? `${quote.change24hPercent >= 0 ? '+' : ''}${quote.change24hPercent.toFixed(2)}%`
      : item.change;
  const isUp =
    quote.change24hPercent != null
      ? quote.change24hPercent >= 0
      : !item.change.startsWith('-');

  const sparkWidth = 56;
  const sparkHeight = 24;
  const sparkData =
    quote.sparkline7d && quote.sparkline7d.length > 1
      ? quote.sparkline7d
      : [quote.priceUsd];
  const min = Math.min(...sparkData);
  const max = Math.max(...sparkData);
  const range = max - min || 1;
  const points = sparkData.map((value, i) => {
    const x =
      sparkData.length === 1
        ? sparkWidth / 2
        : (sparkWidth / (sparkData.length - 1)) * i;
    const normalized = (value - min) / range;
    const y = sparkHeight - normalized * sparkHeight;
    return { x, y };
  });
  const sparkPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('Asset', { id: item.id });
      }}
    >
      <View style={styles.rowLeft}>
        <Image source={{ uri: item.imageURL }} style={styles.rowImage} />
        <View>
          <Text style={styles.rowName}>{item.name}</Text>
          <Text style={styles.rowPair}>
            {item.fromTicker}/{item.toTicker} • CoinGecko
          </Text>
        </View>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowPrice}>
          {item.toSymbol}
          {formatUsdPrice(quote.priceUsd)}
        </Text>
        <Text
          style={[
            styles.rowChange,
            isUp ? styles.positive : styles.negative,
          ]}
        >
          {changeLabel}
        </Text>
        <Svg width={sparkWidth} height={sparkHeight} style={styles.spark}>
          <Path
            d={sparkPath}
            stroke={isUp ? '#22C55E' : '#EF4444'}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 40,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  welcomeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F5C451',
  },
  chartSection: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 2,
    marginBottom: 4,
  },
  portfolioBreakdown: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 10,
  },
  holdingsSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: -4,
    marginBottom: 12,
  },
  holdingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(31, 41, 55, 0.8)',
  },
  holdingRowLast: {
    borderBottomWidth: 0,
  },
  holdingsEmpty: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  portfolioErrorText: {
    fontSize: 11,
    color: '#F87171',
    marginBottom: 8,
  },
  priceHint: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPrimary: {
    backgroundColor: '#F5C451',
  },
  actionPrimaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  actionGhost: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
  },
  actionGhostText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  svgContainer: {
    marginTop: 4,
    height: 100,
  },
  section: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  rowPair: {
    fontSize: 12,
    color: '#6B7280',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  rowPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  rowChange: {
    fontSize: 12,
    marginTop: 2,
  },
  positive: {
    color: '#22C55E',
  },
  negative: {
    color: '#EF4444',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  gridItem: {
    width: '30%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.9)',
    alignItems: 'center',
  },
  gridImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 6,
  },
  gridName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  gridPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  gridChange: {
    fontSize: 11,
    marginTop: 2,
  },
  spark: {
    marginTop: 4,
  },
});

export default TradingDashboardScreen;

