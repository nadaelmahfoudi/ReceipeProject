import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, Image, TouchableOpacity, 
  StyleSheet, ActivityIndicator 
} from 'react-native';

const RecipeListScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=b'); // ✅ Fetch all meals by first letter (A)
        const data = await response.json();

        if (data.meals) {
          setRecipes(data.meals); 
        } else {
          setRecipes([]); 
        }

      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false); // ✅ Stop loading
      }
    };

    fetchRecipes();
  }, []);

  return (
    <View style={styles.container}>
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
});

export default RecipeListScreen;
