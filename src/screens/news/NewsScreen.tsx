import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import type { CryptoNewsArticle } from '../../services/cryptoNews';
import {
  fetchCryptoNews,
  formatNewsTime,
  primaryCategory,
  summarizeBody,
} from '../../services/cryptoNews';

type Props = NativeStackScreenProps<RootStackParamList, 'News'>;

const NewsScreen: React.FC<Props> = ({ navigation }) => {
  const [articles, setArticles] = useState<CryptoNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await fetchCryptoNews();
      setError(null);
      setArticles(data.slice(0, 40));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load news');
      setArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const openArticle = (a: CryptoNewsArticle) => {
    navigation.navigate('NewsDetail', {
      title: a.title,
      body: a.body,
      source: a.source,
      url: a.url,
      publishedOn: a.published_on,
      imageUrl: a.imageurl,
      categories: a.categories,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Crypto news</Text>
      </View>
      <Text style={styles.hint}>
        Powered by CryptoCompare — crypto market headlines & analysis.
      </Text>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F5C451" />
          <Text style={styles.loadingText}>Loading headlines…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retry} onPress={() => load(false)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor="#F5C451"
            />
          }
        >
          {articles.map(article => (
            <View key={String(article.id)} style={styles.card}>
              <View style={styles.tagRow}>
                <Text style={styles.tag}>
                  {primaryCategory(article.categories)}
                </Text>
                <Text style={styles.time}>
                  {formatNewsTime(article.published_on)}
                </Text>
              </View>
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.summary}>{summarizeBody(article.body)}</Text>
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => openArticle(article)}
                activeOpacity={0.8}
              >
                <Text style={styles.readMoreText}>Read more</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  hint: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 13,
    color: '#F87171',
    textAlign: 'center',
    marginBottom: 12,
  },
  retry: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
  },
  retryText: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  card: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.9)',
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tag: {
    fontSize: 11,
    color: '#F5C451',
  },
  time: {
    fontSize: 11,
    color: '#6B7280',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  summary: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  readMoreButton: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  readMoreText: {
    fontSize: 12,
    color: '#60A5FA',
  },
});

export default NewsScreen;
