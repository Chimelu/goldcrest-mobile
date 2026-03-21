import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { GOLDCREST_LOGO } from '../../constants/branding';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={GOLDCREST_LOGO}
        style={styles.logoImage}
        resizeMode="contain"
        accessibilityLabel="Goldcrest logo"
      />
      <Text style={styles.subtitle}>Track crypto trends. See the bigger picture.</Text>
      <ActivityIndicator size="small" color="#F5C451" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 220,
    height: 220,
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 14,
    color: '#9CA3AF',
  },
  spinner: {
    marginTop: 24,
  },
});

export default SplashScreen;

