import { useEffect, useState } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlmaUPost, AlmaUPostsResponse } from '@/utils/types';
import { Link } from 'expo-router';

const API_ENDPOINT = "https://almau.edu.kz/wp-json/wp/v2/posts/";

export const removeHTML = (html: string) => html.replace(/<[^>]*>/gm, '').replace(/\[&hellip;\]/g, '...');

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<AlmaUPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }

        const data: AlmaUPostsResponse = await response.json();

        setPosts(data);
      } catch (e) {
        console.error(e);
        setError('Не удалось загрузить новости')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, []);

  const renderItem: ListRenderItem<AlmaUPost> = ({ item }) => (
    <Link href={`/${item.id}`} style={styles.item}>
      <View>
        <Text style={styles.itemTitle}>
          {item.title?.rendered ?? "Нет заголовка"}  
        </Text>
        <Text style={styles.itemExcerpt}>
          {item.excerpt?.rendered
            ? removeHTML(item.excerpt.rendered).substring(0, 150)
            : "Нет описания"}
        </Text>
      </View>
    </Link>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новости AlmaU</Text>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0056b3", 
  },
  itemExcerpt: {
    marginTop: 5,
    fontSize: 14, 
    color: "#555",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
})