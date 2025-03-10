import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MealsByFirstLetterScreen = () => {
  const [letter, setLetter] = useState('A');
  const [meals, setMeals] = useState([]);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
      setMeals(response.data.meals || []);
    } catch (error) {
      console.error('Error fetching meals by letter:', error);
    }
  };

  React.useEffect(() => {
    fetchMeals();
  }, [letter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meals by First Letter</Text>
      <TouchableOpacity onPress={() => setLetter('A')}>
        <Text>Load Meals Starting with "A"</Text>
      </TouchableOpacity>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.strMealThumb }} style={styles.image} />
            <Text style={styles.name}>{item.strMeal}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  card: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 60, height: 60, borderRadius: 5, marginRight: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
});

export default MealsByFirstLetterScreen;
