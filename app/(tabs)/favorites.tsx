import { StyleSheet, Text, View, FlatList, Pressable, StatusBar, ListRenderItem } from "react-native";
import { useFavorites } from "@/context/FavoritesContext";
import { Link } from "expo-router";

export default function Favorites() {
  const { favorites, loadingFavorites, removeFavorite } = useFavorites();

  if (loadingFavorites) {
    return (
      <View style={styles.centered}>
        <Text>Загрузка избранного...</Text>
      </View>
    )
  }

  const renderItem: ListRenderItem<{ id: number, title: string }> = ({ item }) => (
    <View style={styles.item}>
      <Link href={`/(tabs)/${item.id}`} style={styles.itemLink}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </Link>

      <Pressable onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Удалить</Text>
      </Pressable>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мое избранное</Text>

      {favorites.length === 0 ? (
        <View style={styles.centered}>
          <Text>Список избранного пуст.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  )
}
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
  itemLink: {
    flex: 1,
    marginRight: 20
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
  removeButton: {
    padding: 5,
    backgroundColor: '#dc3545',
    borderRadius: 5
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14
  }
})