import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { formatNewsTime, primaryCategory } from '../../services/cryptoNews';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

const NewsDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title, body, source, url, publishedOn, imageUrl, categories } =
    route.params;

  const openOriginal = () => {
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Article
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.meta}>
          {primaryCategory(categories)} · {formatNewsTime(publishedOn)}
        </Text>
        <Text style={styles.sourceLabel}>{source}</Text>
        <Text style={styles.title}>{title}</Text>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : null}
        <Text style={styles.body}>{body}</Text>
        <TouchableOpacity style={styles.linkButton} onPress={openOriginal}>
          <Text style={styles.linkText}>Open full story in browser →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    flex: 1,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  sourceLabel: {
    fontSize: 13,
    color: '#F5C451',
    fontWeight: '600',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#111827',
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: '#D1D5DB',
  },
  linkButton: {
    marginTop: 24,
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    color: '#60A5FA',
    fontWeight: '600',
  },
});

export default NewsDetailScreen;
