import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Image, StyleSheet } from 'react-native';

const MealDetailsScreen = ({ route }) => {
  const { idMeal } = route.params;
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
        setMeal(response.data.meals[0]);
      } catch (error) {
        console.error('Error fetching meal details:', error);
      }
    };

    fetchMealDetails();
  }, [idMeal]);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  name: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
});

export default MealDetailsScreen;
