import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Corrected import for newer versions

const AddRecipeScreen = ({ navigation }) => {
  const [recipeName, setRecipeName] = useState('');
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const pickImage = () => {
    const options = {
      title: 'Select Recipe Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {  // Using launchImageLibrary directly
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.uri) {
        setImage(response.uri); // Set the image URI
      }
    });
  };

  const handleAddRecipe = () => {
    if (!recipeName || !ingredients || !instructions || !image) {
      Alert.alert('Error', 'Please fill all the fields and add an image.');
    } else {
      const newRecipe = {
        name: recipeName,
        image: image,
        ingredients: ingredients,
        instructions: instructions,
      };

      // Here you would typically send the new recipe to your backend or store it locally
      console.log('New Recipe:', newRecipe);
      Alert.alert('Success', 'Recipe added successfully!');
      navigation.goBack(); // Go back to the previous screen
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Add a New Recipe</Text>

        {/* Recipe Name */}
        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          value={recipeName}
          onChangeText={setRecipeName}
        />

        {/* Recipe Ingredients */}
        <TextInput
          style={styles.input}
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChangeText={setIngredients}
        />

        {/* Recipe Instructions */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Instructions"
          multiline
          value={instructions}
          onChangeText={setInstructions}
        />

        {/* Add Image Button */}
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Pick an Image</Text>
        </TouchableOpacity>

        {/* Display Selected Image */}
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        {/* Add Recipe Button */}
        <Button title="Add Recipe" onPress={handleAddRecipe} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // To make the text start from the top
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default AddRecipeScreen;
