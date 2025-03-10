import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.idCategory}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.strCategory}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  card: { marginVertical: 10 },
});

export default CategoriesScreen;
