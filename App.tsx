import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchMealScreen from './android/app/src/screens/SearchMealScreen';
import MealsByFirstLetterScreen from './android/app/src/screens/MealsByFirstLetterScreen';
import MealDetailsScreen from './android/app/src/screens/MealDetailsScreen';
import RandomMealScreen from './android/app/src/screens/RandomMealScreen';
import CategoriesScreen from './android/app/src/screens/CategoriesScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RandomMeal">
        <Stack.Screen name="SearchMeal" component={SearchMealScreen} />
        <Stack.Screen name="MealsByFirstLetter" component={MealsByFirstLetterScreen} />
        <Stack.Screen name="MealDetails" component={MealDetailsScreen} />
        <Stack.Screen name="RandomMeal" component={RandomMealScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
