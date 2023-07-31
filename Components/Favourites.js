import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Favorites = () => {
    const navigation = useNavigation();
    const [favoriteMovies, setFavoriteMovies] = useState([]);
  
    useEffect(() => {
      loadFavoriteMovies();
    }, []);
  
    const loadFavoriteMovies = async () => {
      try {
        const storedFavoriteMovies = await AsyncStorage.getItem('favoriteMovies');
        if (storedFavoriteMovies) {
          setFavoriteMovies(JSON.parse(storedFavoriteMovies));
        }
      } catch (error) {
        console.error('Error loading favorite movies:', error);
      }
    };
  
    const removeFromFavorites = async (movie) => {
      const updatedFavorites = favoriteMovies.filter((favMovie) => favMovie.id !== movie.id);
      setFavoriteMovies(updatedFavorites);
      try {
        await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    };
  
    const handleMoviePress = (movie) => {
      // Navigate to the Details screen and pass the movie object as a parameter
      navigation.navigate('Details', { movie });
    };
  
    const renderFavoriteMovieItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleMoviePress(item)}>
        <View style={styles.favoriteMovieItem}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
            style={styles.favoritePoster}
          />
          <Text>{item.title}</Text>
          <Text>Average Rating: {item.vote_average}</Text>
          <Text style={styles.removeButton} onPress={() => removeFromFavorites(item)}>
            Remove from Favorites
          </Text>
        </View>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        {/* ... (Existing code) */}
        <FlatList
          data={favoriteMovies}
          renderItem={renderFavoriteMovieItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.favoritesList}
        />
      </View>
    );
  };
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
    },
    favoritesHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    favoriteMovieItem: {
      marginBottom: 20,
      alignItems: 'center',
    },
    favoritePoster: {
      width: 150,
      height: 225,
    },
    favoritesList: {
      padding: 10,
    },
  });
  
  export default Favorites;
  