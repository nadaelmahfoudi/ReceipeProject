import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeListScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=b'); 
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
    loadFavorites(); // Charger les favoris au démarrage
  }, []);

  // Charger les favoris depuis AsyncStorage
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

  // Ajouter ou supprimer des favoris
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

  return (
    <View style={styles.container}>
      {/* Bouton pour voir les favoris */}
      <TouchableOpacity 
        style={styles.favoritesButton} 
        onPress={() => navigation.navigate('FavoritesScreen')}
      >
        <Text style={styles.favoritesButtonText}>💖 Voir les favoris</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Liste des Recettes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            >
              <Image source={{ uri: item.strMealThumb }} style={styles.image} />
              <Text style={styles.name}>{item.strMeal}</Text>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item)}
              >
                <Text style={styles.favoriteText}>
                  {favorites.some(fav => fav.idMeal === item.idMeal) ? '💖 Retirer' : '🤍 Ajouter'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noData}>Aucune recette trouvée.</Text> 
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  favoritesButton: {
    backgroundColor: '#ff69b4',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  favoritesButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  favoriteButton: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeListScreen;
