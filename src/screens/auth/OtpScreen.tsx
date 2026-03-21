import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import {
  resendRegistrationOtp,
  verifyRegistrationOtp,
} from '../../services/authApi';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const OtpScreen: React.FC<Props> = ({ navigation, route }) => {
  const email = route.params?.email ?? '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onVerify = async () => {
    const digits = code.replace(/\D/g, '').slice(0, 6);
    if (digits.length !== 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    if (!email) {
      setError('Missing email. Go back and create your account again.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await verifyRegistrationOtp(email, digits);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const onResend = useCallback(async () => {
    if (!email) return;
    try {
      setResending(true);
      setError(null);
      await resendRegistrationOtp(email);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not resend');
    } finally {
      setResending(false);
    }
  }, [email]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Verify it’s you</Text>
        <Text style={styles.subtitle}>
          We’ve sent a 6‑digit code to {email || 'your email'}. Enter it below to verify
          your account.
        </Text>

        <Text style={styles.label}>Verification code</Text>
        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="000000"
          placeholderTextColor="#4B5563"
          autoFocus
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={styles.primaryLabel}>Verify & continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onResend}
          disabled={resending || !email}
        >
          {resending ? (
            <ActivityIndicator color="#9CA3AF" />
          ) : (
            <Text style={styles.secondaryLabel}>Resend code</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#9CA3AF',
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  codeInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 24,
    letterSpacing: 8,
    color: '#F9FAFB',
    backgroundColor: '#020617',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#F87171',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});

export default OtpScreen;
