import React, { useState } from 'react';
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
import { requestPasswordReset } from '../../services/authApi';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError('Enter the email for your account.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await requestPasswordReset(trimmed);
      navigation.navigate('Otp', { email: trimmed, flow: 'passwordReset' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backWrap}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Forgot password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we’ll send a 6-digit code to reset your password. Only
          verified accounts can use this flow.
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={styles.primaryLabel}>Send reset code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryLabel}>Back to sign in</Text>
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
    paddingTop: 48,
    paddingBottom: 32,
  },
  backWrap: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 28,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5E7EB',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#F9FAFB',
    backgroundColor: '#020617',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#F87171',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
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
  },
  secondaryLabel: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});

export default ForgotPasswordScreen;
