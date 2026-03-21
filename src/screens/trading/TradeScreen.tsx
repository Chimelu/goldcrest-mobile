import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { assets } from '../../data/tradingAssets';
import { useCryptoPrices } from '../../context/CryptoPricesContext';
import { formatUsdPrice } from '../../services/coinGecko';

type Props = NativeStackScreenProps<RootStackParamList, 'Trade'>;

const TradeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, side } = route.params;
  const { getQuote, quotesByAssetId } = useCryptoPrices();

  const asset = useMemo(
    () => assets.find(a => a.id === id),
    [id],
  );

  const [pay, setPay] = useState('');
  const [receive, setReceive] = useState('');

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
            Same USD price as watchlist (CoinGecko). Quote only—not an exchange
            order.
          </Text>
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
          style={styles.confirmButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.confirmText}>
            Confirm {isBuy ? 'buy' : 'sell'}
          </Text>
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
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});

export default TradeScreen;

