import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { deleteAccount, getProfile, setAuthToken } from '../../services/authApi';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAccess } from '../../context/AccessContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { clear: clearPortfolio } = usePortfolio();
  const { setCanTransact } = useAccess();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const initials = useMemo(() => {
    if (!fullName.trim()) return 'U';
    const parts = fullName.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p.charAt(0).toUpperCase()).join('');
  }, [fullName]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setProfileError(null);
        const profile = await getProfile();
        setFullName((profile.fullName as string | null) || '');
        setEmail((profile.email as string) || '');
        setIsVerified(Boolean(profile.isVerified));
        setCanTransact(Boolean(profile.canTransact));
      } catch (e) {
        setProfileError(e instanceof Error ? e.message : 'Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, []);

  const onLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          clearPortfolio();
          setCanTransact(false);
          setAuthToken(null);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        },
      },
    ]);
  };

  const onDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This action is permanent and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              clearPortfolio();
              setCanTransact(false);
              setAuthToken(null);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            } catch (e) {
              Alert.alert(
                'Delete failed',
                e instanceof Error ? e.message : 'Could not delete account',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Account & Security</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            {loadingProfile ? (
              <ActivityIndicator size="small" color="#9CA3AF" />
            ) : (
              <>
                <Text style={styles.name}>{fullName || 'User'}</Text>
                <Text style={styles.email}>{email || 'No email'}</Text>
              </>
            )}
          </View>
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>
              {isVerified ? 'Verified' : 'Unverified'}
            </Text>
          </View>
        </View>
        {profileError ? <Text style={styles.errorText}>{profileError}</Text> : null}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Profile</Text>
          <TouchableOpacity
            style={styles.itemRow}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PersonalInfo')}
          >
            <View>
              <Text style={styles.itemTitle}>Personal information</Text>
              <Text style={styles.itemSub}>Name, contact details</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Security</Text>
          <TouchableOpacity
            style={styles.itemRow}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View>
              <Text style={styles.itemTitle}>Change password</Text>
              <Text style={styles.itemSub}>Update your sign-in password</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/*
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>KYC & verification</Text>
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>Identity verification</Text>
                <Text style={styles.itemSub}>
                  Required to increase limits and withdraw
                </Text>
              </View>
              <View style={styles.chipPending}>
                <Text style={styles.chipPendingText}>Pending</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Kyc')}
            >
              <Text style={styles.primaryButtonText}>Start verification</Text>
            </TouchableOpacity>
          </View>
        */}

        {/*
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Security</Text>
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>Two-factor authentication</Text>
                <Text style={styles.itemSub}>
                  Add an extra layer of protection
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  twoFactorEnabled ? styles.toggleOn : styles.toggleOff,
                ]}
                onPress={() => setTwoFactorEnabled(prev => !prev)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    twoFactorEnabled ? styles.toggleThumbOn : styles.toggleThumbOff,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        */}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Account actions</Text>
          <TouchableOpacity
            style={[styles.accountActionButton, styles.logoutButton]}
            activeOpacity={0.85}
            onPress={onLogout}
          >
            <Text style={styles.accountActionText}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.accountActionButton, styles.deleteButton]}
            activeOpacity={0.85}
            onPress={onDeleteAccount}
          >
            <Text style={styles.deleteActionText}>Delete account</Text>
          </TouchableOpacity>
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
  profileCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.7)',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5C451',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  email: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.7)',
  },
  editText: {
    fontSize: 12,
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    marginVertical: 4,
  },
  chipPending: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F9731620',
  },
  chipPendingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F97316',
  },
  chipOff: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  chipOffText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F9FAFB',
    fontSize: 14,
    backgroundColor: '#020617',
  },
  primaryButton: {
    marginTop: 10,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5C451',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  secondaryButton: {
    marginTop: 4,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.7)',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  editBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#16A34A20',
  },
  editBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  errorText: {
    fontSize: 12,
    color: '#F87171',
    marginTop: -8,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: '#22C55E',
    justifyContent: 'flex-end',
  },
  toggleOff: {
    backgroundColor: '#111827',
    justifyContent: 'flex-start',
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  toggleThumbOn: {
    backgroundColor: '#022C22',
  },
  toggleThumbOff: {
    backgroundColor: '#6B7280',
  },
  accountActionButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
    marginBottom: 10,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.55)',
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
  },
  accountActionText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteActionText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;

