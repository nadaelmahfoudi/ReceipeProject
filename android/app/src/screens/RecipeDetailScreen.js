import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.name}>{recipe.strMeal}</Text>
      <Text style={styles.category}>{recipe.strCategory}</Text>
      <Text style={styles.area}>Origine: {recipe.strArea}</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  category: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'gray',
    marginBottom: 5,
  },
  area: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'justify',
  },
});

export default RecipeDetailScreen;
