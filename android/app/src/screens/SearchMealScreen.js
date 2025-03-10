import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet } from 'react-native';

const SearchMealScreen = () => {
  const [mealName, setMealName] = useState('');
  const [meals, setMeals] = useState([]);

  const searchMeal = async () => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
      setMeals(response.data.meals || []);
    } catch (error) {
      console.error('Error searching meal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Meal by Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter meal name"
        value={mealName}
        onChangeText={setMealName}
      />
      <Button title="Search" onPress={searchMeal} />
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
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8 },
  card: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  image: { width: 60, height: 60, borderRadius: 5, marginRight: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
});

export default SearchMealScreen;
