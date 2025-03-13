import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchMealScreen from './android/app/src/screens/SearchMealScreen';
import RecipeDetailScreen from './android/app/src/screens/RecipeDetailScreen';
import RandomMealScreen from './android/app/src/screens/RandomMealScreen';
import RecipeListScreen from './android/app/src/screens/RecipeListScreen';
import FavoritesScreen from './android/app/src/screens/FavoritesScreen';
import AddRecipeScreen from './android/app/src/screens/AddRecipeScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListMeal">
        <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
        <Stack.Screen name="SearchMeal" component={SearchMealScreen} />
        <Stack.Screen name="ListMeal" component={RecipeListScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="RandomMeal" component={RandomMealScreen} />
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ title: 'Favoris' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
