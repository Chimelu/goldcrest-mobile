import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import TradingDashboardScreen from '../screens/trading/TradingDashboardScreen';
import CryptoAssetScreen from '../screens/trading/CryptoAssetScreen';
import TradeScreen from '../screens/trading/TradeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import KycScreen from '../screens/profile/KycScreen';
import NewsScreen from '../screens/news/NewsScreen';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';
import WalletScreen from '../screens/wallet/WalletScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  CreateAccount: undefined;
  Login: undefined;
  Otp: { email?: string } | undefined;
  Main: undefined;
  Asset: { id: string };
  Trade: { id: string; side: 'buy' | 'sell' };
  PersonalInfo: undefined;
  ChangePassword: undefined;
  Kyc: undefined;
  News: undefined;
  NewsDetail: {
    title: string;
    body: string;
    source: string;
    url: string;
    publishedOn: number;
    imageUrl?: string;
    categories?: string;
  };
  Wallet: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Wallet: undefined;
  News: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#020617',
          borderTopColor: 'rgba(31, 41, 55, 0.9)',
          height: 70,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          let label = '';

          if (route.name === 'Home') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            label = 'Trade';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
            label = 'Profile';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
            label = 'Wallet';
          } else if (route.name === 'News') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
            label = 'News';
          }

          return (
            <React.Fragment>
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? '#F5C451' : '#9CA3AF'}
                style={{ marginTop: 4 }}
              />
              <Text
                style={{
                  fontSize: 11,
                  marginTop: 2,
                  color: focused ? '#F5C451' : '#9CA3AF',
                }}
              >
                {label}
              </Text>
            </React.Fragment>
          );
        },
        tabBarActiveTintColor: '#F5C451',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      <Tab.Screen name="Home" component={TradingDashboardScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
    </Tab.Navigator>
  );
};

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Asset" component={CryptoAssetScreen} />
        <Stack.Screen name="Trade" component={TradeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Kyc" component={KycScreen} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

