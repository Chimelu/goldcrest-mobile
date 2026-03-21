import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

type TabKey = 'Profile' | 'Wallet' | 'Trade' | 'News';

const BottomNav: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const routeName = route.name;

  const active: TabKey =
    routeName === 'Profile'
      ? 'Profile'
      : routeName === 'Wallet'
      ? 'Wallet'
      : routeName === 'News'
      ? 'News'
      : 'Trade';

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.8}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Profile');
          }}
        >
          <Text
            style={[
              styles.tabLabel,
              active === 'Profile' && styles.tabLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.8}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Wallet');
          }}
        >
          <Text
            style={[
              styles.tabLabel,
              active === 'Wallet' && styles.tabLabelActive,
            ]}
          >
            Wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tradeTab}
          activeOpacity={0.9}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.tradeLabel}>Trade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          activeOpacity={0.8}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('News');
          }}
        >
          <Text
            style={[
              styles.tabLabel,
              active === 'News' && styles.tabLabelActive,
            ]}
          >
            News
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#020617',
  },
  bar: {
    marginHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#020617',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tabLabelActive: {
    color: '#F5C451',
    fontWeight: '600',
  },
  tradeTab: {
    flex: 1.4,
    marginHorizontal: 6,
    borderRadius: 999,
    backgroundColor: '#F5C451',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
});

export default BottomNav;

