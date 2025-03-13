import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator, SafeAreaView, StatusBar,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

const RecipeListScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='); 
        const data = await response.json();

        if (data.meals) {
          setRecipes(data.meals);
        } else {
          setRecipes([]);
        }

      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Erreur de chargement des favoris", error);
    }
  };

  const toggleFavorite = async (recipe) => {
    let updatedFavorites = [...favorites];

    if (favorites.some(fav => fav.idMeal === recipe.idMeal)) {
      updatedFavorites = updatedFavorites.filter(fav => fav.idMeal !== recipe.idMeal);
    } else {
      updatedFavorites.push(recipe);
    }

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const renderRecipeCard = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.idMeal === item.idMeal);
    
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.strMealThumb }} style={styles.image} />
          <TouchableOpacity 
            style={[styles.favoriteButton, isFavorite ? styles.favoriteActive : {}]}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item);
            }}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          
          <View style={styles.gradient} />
          
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.strCategory || 'Meal'}</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={2}>{item.strMeal}</Text>
          <Text style={styles.cuisine}>{item.strArea || 'International'} Cuisine</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={styles.metaText}>20 mins</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🔥</Text>
              <Text style={styles.metaText}>Medium</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.title}>Délicieuses Recettes</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.favoritesButton} 
            onPress={() => navigation.navigate('FavoritesScreen')}
          >
            <Text style={styles.favoritesButtonText}>Voir favoris</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{favorites.length}</Text>
            </View>
          </TouchableOpacity>

          {/* Add Recipe Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddRecipe')} 
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF5252" />
          <Text style={styles.loaderText}>Préparation des recettes...</Text>
        </View>
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal.toString()}
          renderItem={renderRecipeCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5169/5169269.png' }} 
            style={styles.emptyImage} 
          />
          <Text style={styles.noData}>Aucune recette trouvée</Text>
          <Text style={styles.emptySubtext}>Essayez une autre recherche</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoritesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5252',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favoritesButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  badgeContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#FF5252',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 16,
    backgroundColor: '#FF5252',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: cardWidth,
    alignSelf: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  favoriteActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#757575',
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.7,
  },
  noData: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#616161',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
  },
});

export default RecipeListScreen;
