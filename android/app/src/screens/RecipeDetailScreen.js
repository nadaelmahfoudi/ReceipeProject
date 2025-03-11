import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView,
  Animated,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('ListMeal')} // Go to RecipeListScreen (ListMeal)
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      ),
    });

    checkFavoriteStatus();
    
    extractIngredients();
  }, [navigation, isFavorite]);

  const extractIngredients = () => {
    const extractedIngredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== '') {
        extractedIngredients.push({
          ingredient: ingredient,
          measure: measure || ''
        });
      }
    }
    
    setIngredients(extractedIngredients);
  };

  const checkFavoriteStatus = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        const favoritesArray = JSON.parse(savedFavorites);
        setIsFavorite(favoritesArray.some(fav => fav.idMeal === recipe.idMeal));
      }
    } catch (error) {
      console.error("Error checking favorite status", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      if (isFavorite) {
        favoritesArray = favoritesArray.filter(fav => fav.idMeal !== recipe.idMeal);
      } else {
        favoritesArray.push(recipe);
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const instructionSteps = recipe.strInstructions
    .split(/\.\s+/)
    .filter(step => step.trim().length > 0)
    .map(step => step.trim() + (step.endsWith('.') ? '' : '.'));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated header background */}
      <Animated.View 
        style={[ styles.headerBackground, { opacity: headerOpacity } ]} 
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }], 
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
          <View style={styles.imageFade} />
        </View>
        
        <View style={styles.contentCard}>
          <Text style={styles.name}>{recipe.strMeal}</Text>
          
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{recipe.strCategory}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{recipe.strArea}</Text>
            </View>
          </View>
          
          <View style={styles.separator} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingrédients</Text>
            <View style={styles.ingredientsContainer}>
              {ingredients.map((item, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientBullet} />
                  <Text style={styles.ingredientText}>
                    <Text style={styles.ingredientAmount}>{item.measure}</Text> {item.ingredient}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {instructionSteps.map((step, index) => (
              <View key={index} style={styles.instructionStep}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#fff',
    zIndex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 18,
    marginLeft: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B86E5',
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    color: '#5B86E5',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  ingredientsContainer: {
    flexDirection: 'column',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: '#424242',
    flex: 1,
  },
  ingredientAmount: {
    fontWeight: 'bold',
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    color: '#424242',
    flex: 1,
    lineHeight: 24,
  }
});

export default RecipeDetailScreen;
