import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { assets } from '../../data/tradingAssets';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const [showDepositDetails, setShowDepositDetails] = useState(false);
  const [showWithdrawDetails, setShowWithdrawDetails] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawNetwork, setWithdrawNetwork] = useState('ERC20');

  const cryptoAssets = useMemo(
    () => assets.filter(a => a.type === 'crypto'),
    [],
  );

  const totalValue = useMemo(
    () =>
      cryptoAssets.reduce(
        (sum, asset) => sum + (Number(asset.sellPrice) || 0),
        0,
      ),
    [cryptoAssets],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total value</Text>
          <Text style={styles.summaryValue}>
            $
            {totalValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.summarySub}>
            Across all crypto balances (demo data)
          </Text>
          <View style={styles.summaryActionsRow}>
            <TouchableOpacity
              style={[styles.pillButton, styles.primaryPill]}
              onPress={() => {
                setShowDepositDetails(prev => !prev);
                setShowWithdrawDetails(false);
              }}
            >
              <Text style={styles.primaryPillText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pillButton, styles.ghostPill]}
              onPress={() => {
                setShowWithdrawDetails(prev => !prev);
                setShowDepositDetails(false);
              }}
            >
              <Text style={styles.ghostPillText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          {showDepositDetails && (
            <View style={styles.actionDetailsCard}>
              <Text style={styles.detailsTitle}>Deposit USDT (ERC20)</Text>
              <Text style={styles.detailsText}>
                Send only USDT via ERC20 to this wallet address. Minimum deposit:
                10 USDT.
              </Text>
              <Text style={styles.addressLabel}>Wallet address</Text>
              <Text style={styles.addressValue}>
                0x8D7aE4f2B091e58e19CB79A40A6f7d3a9B8C2D51
              </Text>
              <Text style={styles.detailsHint}>
                Deposits usually confirm within 1-10 minutes after network
                confirmations.
              </Text>
            </View>
          )}
          {showWithdrawDetails && (
            <View style={styles.actionDetailsCard}>
              <Text style={styles.detailsTitle}>Withdraw crypto</Text>
              <Text style={styles.detailsText}>
                Enter amount and destination wallet. Verify network carefully
                before submitting.
              </Text>
              <Text style={styles.inputLabel}>Amount (USDT)</Text>
              <TextInput
                style={styles.input}
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#6B7280"
              />
              <Text style={styles.inputLabel}>Destination address</Text>
              <TextInput
                style={styles.input}
                value={withdrawAddress}
                onChangeText={setWithdrawAddress}
                autoCapitalize="none"
                placeholder="0x..."
                placeholderTextColor="#6B7280"
              />
              <Text style={styles.inputLabel}>Network</Text>
              <View style={styles.networkRow}>
                {['ERC20', 'TRC20', 'BEP20'].map(network => (
                  <TouchableOpacity
                    key={network}
                    style={[
                      styles.networkChip,
                      withdrawNetwork === network && styles.networkChipActive,
                    ]}
                    onPress={() => setWithdrawNetwork(network)}
                  >
                    <Text
                      style={[
                        styles.networkChipText,
                        withdrawNetwork === network && styles.networkChipTextActive,
                      ]}
                    >
                      {network}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit withdrawal</Text>
              </TouchableOpacity>
              <Text style={styles.detailsHint}>
                A network fee may apply. Withdrawals are reviewed for account
                safety.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Crypto balances</Text>
          {cryptoAssets.map(asset => (
            <View key={asset.id} style={styles.assetRow}>
              <View>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetSub}>
                  {asset.toTicker} • Crypto • Demo
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.assetValue}>
                  {asset.toSymbol}
                  {asset.sellPrice}
                </Text>
                <Text
                  style={[
                    styles.assetChange,
                    asset.change.startsWith('-')
                      ? styles.negative
                      : styles.positive,
                  ]}
                >
                  {asset.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Funding & limits</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Deposit status</Text>
            <Text style={styles.infoValue}>Enabled</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Withdrawal status</Text>
            <Text style={styles.infoValue}>Enabled</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Daily limit</Text>
            <Text style={styles.infoValue}>$50,000.00</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  summaryCard: {
    borderRadius: 18,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 4,
  },
  summarySub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  summaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  pillButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPill: {
    backgroundColor: '#F5C451',
  },
  primaryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  ghostPill: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
  },
  ghostPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  sectionCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.9)',
  },
  sectionLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  assetName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  assetSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  assetValue: {
    fontSize: 14,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 13,
    color: '#F9FAFB',
  },
  actionDetailsCard: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    backgroundColor: '#0B1220',
    padding: 12,
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 6,
  },
  detailsText: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    marginBottom: 10,
  },
  addressLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 12,
    color: '#E5E7EB',
    fontWeight: '600',
    lineHeight: 18,
  },
  detailsHint: {
    marginTop: 10,
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
    color: '#F9FAFB',
    backgroundColor: '#020617',
  },
  networkRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
  },
  networkChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  networkChipActive: {
    backgroundColor: '#F5C451',
    borderColor: '#F5C451',
  },
  networkChipText: {
    fontSize: 11,
    color: '#E5E7EB',
  },
  networkChipTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  submitButton: {
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: '#F5C451',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
});

export default WalletScreen;

