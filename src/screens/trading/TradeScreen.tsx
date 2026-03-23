import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { useFocusEffect } from '@react-navigation/native';
import { assets } from '../../data/tradingAssets';
import { useCryptoPrices } from '../../context/CryptoPricesContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAccess } from '../../context/AccessContext';
import {
  formatCryptoQuantity,
  getCryptoQuantityForTicker,
} from '../../utils/portfolioHelpers';
import { formatUsdPrice } from '../../services/coinGecko';
import { buyCrypto, sellCrypto } from '../../services/portfolioApi';

type Props = NativeStackScreenProps<RootStackParamList, 'Trade'>;

const TradeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, side } = route.params;
  const { getQuote, quotesByAssetId } = useCryptoPrices();
  const { summary, loading: portfolioLoading, error: portfolioError, refresh } =
    usePortfolio();
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

  const [pay, setPay] = useState('');
  const [receive, setReceive] = useState('');
  const [tradeLoading, setTradeLoading] = useState(false);

  const price = useMemo(
    () => (asset ? getQuote(asset).priceUsd : 0),
    [asset, getQuote, quotesByAssetId],
  );

  const handlePayChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    setPay(cleaned);
    const value = Number(cleaned) || 0;
    if (!asset || !price || !value) {
      setReceive('');
      return;
    }
    if (side === 'buy') {
      // Pay USD, receive crypto
      setReceive((value / price).toFixed(6));
    } else {
      // Pay crypto, receive USD
      setReceive((value * price).toFixed(2));
    }
  };

  const handleReceiveChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    setReceive(cleaned);
    const value = Number(cleaned) || 0;
    if (!asset || !price || !value) {
      setPay('');
      return;
    }
    if (side === 'buy') {
      // Receive crypto, compute USD needed
      setPay((value * price).toFixed(2));
    } else {
      // Receive USD, compute crypto to sell
      setPay((value / price).toFixed(6));
    }
  };

  if (!asset) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>Asset not found.</Text>
      </View>
    );
  }

  const isBuy = side === 'buy';
  const cryptoBalance = getCryptoQuantityForTicker(summary, asset.fromTicker);
  const availableUsd = summary ? Number(summary.availableUsd) || 0 : 0;

  const onConfirmTrade = async () => {
    if (!canTransact) {
      Alert.alert(
        'Trading disabled',
        'Your account is not enabled for transactions yet.',
      );
      return;
    }
    const payNum = Number(pay);
    if (!Number.isFinite(payNum) || payNum <= 0) {
      Alert.alert('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }
    if (isBuy && payNum > availableUsd + 1e-6) {
      Alert.alert(
        'Insufficient USD',
        'You cannot spend more than your available USD balance.',
      );
      return;
    }
    if (!isBuy && payNum > cryptoBalance + 1e-12) {
      Alert.alert(
        'Insufficient crypto',
        `You only have ${formatCryptoQuantity(asset.fromTicker, cryptoBalance)} ${asset.fromTicker}.`,
      );
      return;
    }

    setTradeLoading(true);
    try {
      if (isBuy) {
        await buyCrypto(asset.fromTicker, payNum);
      } else {
        await sellCrypto(asset.fromTicker, payNum);
      }
      await refresh();
      Alert.alert(
        'Done',
        isBuy ? 'Your buy was executed at the server price.' : 'Your sell was executed at the server price.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (e) {
      Alert.alert(
        'Trade failed',
        e instanceof Error ? e.message : 'Could not complete trade',
      );
    } finally {
      setTradeLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isBuy ? 'Buy' : 'Sell'} {asset.fromTicker}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Price</Text>
          <Text style={styles.summaryValue}>
            1 {asset.fromTicker} ≈ $
            {formatUsdPrice(price)}
          </Text>
          <Text style={styles.summarySub}>
            App preview uses CoinGecko. Confirm sends the order to Goldcrest — the
            server re-prices at execution time.
          </Text>
        </View>

        <View style={styles.demoBalanceCard}>
          <Text style={styles.demoBalanceTitle}>Your balances</Text>
          {portfolioLoading ? (
            <Text style={styles.demoBalanceLine}>Loading wallet…</Text>
          ) : portfolioError ? (
            <Text style={styles.demoBalanceError}>{portfolioError}</Text>
          ) : (
            <>
              <Text style={styles.demoBalanceLine}>
                USD available: $
                {availableUsd.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text style={styles.demoBalanceLine}>
                {asset.fromTicker} held:{' '}
                {formatCryptoQuantity(asset.fromTicker, cryptoBalance)}{' '}
                {asset.fromTicker}
                {cryptoBalance === 0 ? ' (none yet)' : ''}
              </Text>
              <Text style={styles.demoBalanceHint}>
                Wallet row is created the first time this loads after you sign in.
              </Text>
            </>
          )}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>
            You pay ({isBuy ? 'USD' : asset.toTicker})
          </Text>
          <TextInput
            value={pay}
            onChangeText={handlePayChange}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor="#4B5563"
            style={styles.input}
          />

          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
            You receive ({isBuy ? asset.toTicker : 'USD'})
          </Text>
          <TextInput
            value={receive}
            onChangeText={handleReceiveChange}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor="#4B5563"
            style={styles.input}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estimated fee</Text>
          <Text style={styles.infoValue}>$0.00</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order type</Text>
          <Text style={styles.infoValue}>Market</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, tradeLoading && styles.confirmButtonDisabled]}
          onPress={() => void onConfirmTrade()}
          disabled={tradeLoading || portfolioLoading}
        >
          {tradeLoading ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={styles.confirmText}>
              Confirm {isBuy ? 'buy' : 'sell'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  summaryCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.9)',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginTop: 4,
  },
  summarySub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  demoBalanceCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(245, 196, 81, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 196, 81, 0.35)',
  },
  demoBalanceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F5C451',
    marginBottom: 8,
  },
  demoBalanceLine: {
    fontSize: 13,
    color: '#E5E7EB',
    marginBottom: 4,
  },
  demoBalanceHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
  demoBalanceError: {
    fontSize: 12,
    color: '#F87171',
    marginTop: 4,
  },
  formCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.9)',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F9FAFB',
    fontSize: 15,
    backgroundColor: '#020617',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 13,
    color: '#F9FAFB',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  confirmButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5C451',
    minHeight: 48,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});

export default TradeScreen;

