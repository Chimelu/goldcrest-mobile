import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Kyc'>;

const KycScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why we ask for this</Text>
          <Text style={styles.infoText}>
            To keep your account secure and comply with regulations, we need to
            verify your identity. The documents below are examples only and are
            not uploaded anywhere in this demo.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Step 1 • Personal documents</Text>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemTitle}>Government-issued ID</Text>
              <Text style={styles.itemSub}>
                Passport, national ID card, or driver’s license
              </Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemTitle}>Selfie verification</Text>
              <Text style={styles.itemSub}>
                A clear photo of you holding your ID document
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Step 2 • Address verification</Text>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemTitle}>Proof of address</Text>
              <Text style={styles.itemSub}>
                Recent utility bill, bank statement, or tax letter
              </Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <View>
              <Text style={styles.itemTitle}>Document date</Text>
              <Text style={styles.itemSub}>
                Issued within the last 3 months and clearly legible
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Before you start</Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Make sure your full name and address match your Goldcrest profile.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Photos should be in color, not blurry, and without reflections.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Only upload documents from devices you trust.
            </Text>
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
  infoCard: {
    borderRadius: 18,
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  itemSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
  },
  bulletDot: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  bulletText: {
    fontSize: 12,
    color: '#9CA3AF',
    flex: 1,
    lineHeight: 18,
  },
});

export default KycScreen;

