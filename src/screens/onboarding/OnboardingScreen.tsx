import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { GOLDCREST_LOGO } from '../../constants/branding';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={GOLDCREST_LOGO}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="Goldcrest logo"
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW • GOLDCREST</Text>
          </View>
          <Text style={styles.title}>Track and analyze crypto market trends.</Text>
          <Text style={styles.subtitle}>
            Spot patterns, follow price movements, and make sense of the market—all in one
            place.
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.featureDot} />
            <View style={styles.featureCopy}>
              <Text style={styles.featureTitle}>Market trends</Text>
              <Text style={styles.featureText}>
                See how assets move over time and what’s heating up or cooling down.
              </Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureDot} />
            <View style={styles.featureCopy}>
              <Text style={styles.featureTitle}>Clear analysis</Text>
              <Text style={styles.featureText}>
                Charts and summaries for volatility and momentum at a glance.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.primaryLabel}>Create account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            <Text style={styles.signInMuted}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            For information only—not financial advice. Crypto markets are volatile.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  logoImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 196, 81, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 196, 81, 0.25)',
    marginBottom: 16,
  },
  badgeText: {
    color: '#F5C451',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 12,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#9CA3AF',
    textAlign: 'left',
  },
  features: {
    gap: 18,
    marginBottom: 36,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5C451',
    marginTop: 6,
    opacity: 0.9,
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#9CA3AF',
  },
  ctaSection: {
    marginTop: 'auto',
    paddingTop: 8,
  },
  primaryButton: {
    backgroundColor: '#F5C451',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  signInRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  signInMuted: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  signInLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F5C451',
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default OnboardingScreen;
