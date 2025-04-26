import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  StatusBar,
  Pressable,
} from "react-native"
import { useLocalSearchParams, Stack, useNavigation } from "expo-router" 
import { useEffect, useState, useLayoutEffect } from "react" 
import { AlmaUPost, AlmaUPostsResponse } from "@/utils/types"
import { removeHTML } from "./(tabs)" 
import { useFavorites } from "@/context/FavoritesContext" 
import Ionicons from "@expo/vector-icons/Ionicons"

export default function ArticleDetails() {
  const { articleId } = useLocalSearchParams<{ articleId: string }>()
  const navigation = useNavigation() 
  const { addFavorite, removeFavorite, isFavorite } = useFavorites() 
  const [article, setArticle] = useState<AlmaUPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const id = articleId ? parseInt(articleId, 10) : null 

  const API_ENDPOINT = `https://almau.edu.kz/wp-json/wp/v2/posts/${articleId}`

  useEffect(() => {
    if (id === null || isNaN(id)) {
      setError("Неверный ID статьи")
      setLoading(false)
      return
    }

    const fetchArticleDetails = async () => {
      try {
        const response = await fetch(API_ENDPOINT)
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }

        const data: AlmaUPost = await response.json()
        setArticle(data)
      } catch (err) {
        console.error(err)
        setError("Не удалось загрузить статью")
      } finally {
        setLoading(false)
      }
    }

    fetchArticleDetails()
  }, [articleId, id]) 

  useLayoutEffect(() => {
    if (article) {
      const isCurrentArticleFavorite = isFavorite(article.id)

      navigation.setOptions({
        title: article.title.rendered || "Статья", 
        headerShown: true, 
        headerRight: () => (
          <Pressable
            onPress={() => {
              if (isCurrentArticleFavorite) {
                removeFavorite(article.id)
              } else {
                addFavorite({ id: article.id, title: article.title.rendered })
              }
            }}
          >
            <Ionicons
              name={isCurrentArticleFavorite ? "heart" : "heart-outline"} 
              size={24}
              color={isCurrentArticleFavorite ? "red" : "#555"} 
              style={{ marginRight: 15 }}
            />
                     
          </Pressable>
        ),
      })
    } else {
      navigation.setOptions({
        title: "Загрузка...",
        headerShown: true,
        headerRight: undefined, 
      })
    }
  }, [navigation, article, isFavorite, addFavorite, removeFavorite]) 

  if (loading) {
    return (
      <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />       
        <Text>Загрузка статьи...</Text>     
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>     
      </View>
    )
  }

  if (!article) {
    return (
      <View style={styles.centered}>
                <Text>Статья не найдена.</Text>     
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
           
      
      <View style={styles.separator}>
              
        <Text style={styles.body}>
                   
          {article.content.rendered
            ? removeHTML(article.content.rendered)
            : "Нет текста"}
                 
        </Text>
             
      </View>
         
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  separator: {
    marginVertical: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
})
