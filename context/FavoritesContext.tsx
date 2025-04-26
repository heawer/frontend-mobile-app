import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface FavoriteItem {
  id: number
  title: string
}

interface FavoriteContextType {
  favorites: FavoriteItem[]
  addFavorite: (item: { id: number; title: string }) => Promise<void>
  removeFavorite: (id: number) => Promise<void>
  isFavorite: (id: number) => boolean
  loadingFavorites: boolean
}

const FavoritesContext = createContext<FavoriteContextType | undefined>(
  undefined
)

const STORAGE_KEY = "@MobileApp:favorites"

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY)
        if (storedFavorites !== null) {
          
          const parsedFavorites = JSON.parse(storedFavorites)
          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites)
          } else {
            console.warn(
              "Stored favorites data is not an array:",
              parsedFavorites
            )
            setFavorites([]) // Reset to empty if storage is corrupt
          }
        }
      } catch (e) {
        console.error("Failed to load favorites from storage", e)
        setFavorites([]) // Reset on error
      } finally {
        setLoadingFavorites(false)
      }
    }

    loadFavorites() // Call the async function
  }, [])

  const saveFavorites = async (updatedFavorites: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites))
      setFavorites(updatedFavorites)
    } catch (e) {
      console.error("Failed to save favorites to storage", e)
    }
  }
  const addFavorite = async (item: { id: number; title: string }) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.id === item.id)
    if (!isAlreadyFavorite) {
      const updatedFavorites = [
        ...favorites,
        { id: item.id, title: item.title },
      ]
      await saveFavorites(updatedFavorites)
    }
  }
  const removeFavorite = async (id: number) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id)
    await saveFavorites(updatedFavorites)
  }
  const isFavorite = (id: number) => favorites.some((fav) => fav.id === id)

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loadingFavorites,
      }}
    >
    {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider")
  }

  return context
}
