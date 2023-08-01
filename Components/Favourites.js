import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Favorites = () => {
  const navigation = useNavigation();
  const favoriteMovies = useSelector(state => state.favoriteMovies); // Get the favorite movies from Redux state
  const dispatch = useDispatch(); // Get the dispatch function from Redux to update state

  useEffect(() => {
    loadFavoriteMovies();
  }, []);

  // Function to load favorite movies from AsyncStorage and update Redux state
  const loadFavoriteMovies = async () => {
    try {
      const storedFavoriteMovies = await AsyncStorage.getItem('favoriteMovies');
      if (storedFavoriteMovies) {
        dispatch({ type: 'SET_FAVORITE_MOVIES', payload: JSON.parse(storedFavoriteMovies) });
      }
    } catch (error) {
      console.error('Error loading favorite movies:', error);
    }
  };

  // Function to remove a movie from favorites
  const removeFromFavorites = async (movie) => {
    const updatedFavorites = favoriteMovies.filter((favMovie) => favMovie.id !== movie.id);
    try {
      await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      dispatch({ type: 'SET_FAVORITE_MOVIES', payload: updatedFavorites }); // Dispatch action to update favorites in Redux
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  // Function to handle movie press and navigate to Details screen
  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movie });
  };

  // Function to render each favorite movie item
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
      {/* FlatList to render favorite movie items */}
      <FlatList
        data={favoriteMovies} // Use the favoriteMovies data from Redux store directly
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
  removeButton: {
    color: 'red',
    marginTop: 5,
  },
});

export default Favorites;
