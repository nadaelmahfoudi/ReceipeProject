import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

const RandomMealScreen = () => {
  const [meal, setMeal] = useState(null);

  const fetchRandomMeal = async () => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
      setMeal(response.data.meals[0]);
    } catch (error) {
      console.error('Error fetching random meal:', error);
    }
  };

  useEffect(() => {
    fetchRandomMeal();
  }, []);

  return (
    <View style={styles.container}>
      {meal ? (
        <>
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
          <Text style={styles.name}>{meal.strMeal}</Text>
          <Text>{meal.strInstructions}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <Button title="Get Another Random Meal" onPress={fetchRandomMeal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
});

export default RandomMealScreen;
