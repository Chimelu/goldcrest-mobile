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
import { resetPasswordWithToken } from '../../services/authApi';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { resetToken } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await resetPasswordWithToken(resetToken, newPassword);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reset password');
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
        <Text style={styles.title}>New password</Text>
        <Text style={styles.subtitle}>
          Choose a strong password you haven’t used here before.
        </Text>

        <Text style={styles.label}>New password</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          secureTextEntry
          placeholder="At least 8 characters"
          placeholderTextColor="#4B5563"
        />

        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
          placeholder="Repeat password"
          placeholderTextColor="#4B5563"
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
            <Text style={styles.primaryLabel}>Update password</Text>
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
    marginBottom: 14,
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
    marginTop: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});

export default ResetPasswordScreen;
