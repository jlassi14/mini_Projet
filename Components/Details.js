import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Details = () => {
  const route = useRoute();
  const { movie } = route.params;
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const navigation = useNavigation();

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

  const isMovieFavorite = () => {
    return favoriteMovies.some((favMovie) => favMovie.id === movie.id);
  };

  const addToFavorites = async () => {
    if (!isMovieFavorite()) {
      const updatedFavorites = [...favoriteMovies, movie];
      setFavoriteMovies(updatedFavorites);
      try {
        await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  /*const removeFromFavorites = async () => {
    if (isMovieFavorite()) {
      const updatedFavorites = favoriteMovies.filter((favMovie) => favMovie.id !== movie.id);
      setFavoriteMovies(updatedFavorites);
      try {
        await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    }
  };*/

  return (
    <View style={styles.container}>
    <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }} style={styles.poster} />
    <Text style={styles.title}>{movie.title}</Text>
    {movie.genres ? (
      <Text style={styles.details}>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</Text>
    ) : (
      <Text style={styles.details}>Genres: Not available</Text>
    )}
    <Text style={styles.details}>Release Date: {movie.release_date}</Text>
    <Text style={styles.details}>Duration: {movie.runtime} minutes</Text>
    <Text style={styles.details}>Average Rating: {movie.vote_average}</Text>
    <Text style={styles.overview}>{movie.overview}</Text>


      <View style={styles.favoriteButtonContainer}>
        {isMovieFavorite() ? (
          <Text style={styles.favoriteText} >
            Remove from Favorites
          </Text>
        ) : (
          <Text style={styles.favoriteText} onPress={addToFavorites}>
            Add to Favorites
          </Text>
        )}
      </View>

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  poster: {
    width: 200,
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    marginBottom: 5,
  },
  overview: {
    textAlign: 'center',
    marginBottom: 10,
  },
  favoriteButtonContainer: {
    marginBottom: 10,
  },
  favoriteText: {
    color: 'blue',
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

export default Details;
