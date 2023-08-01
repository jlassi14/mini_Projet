import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const Details = () => {
  // Get the movie object from the route parameters
  const route = useRoute();
  const { movie } = route.params;

  // Initialize navigation and Redux hooks
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favoriteMovies = useSelector(state => state.favoriteMovies);

  // Load favorite movies from AsyncStorage when the component mounts
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

  // Function to check if the movie is in the favorite list
  const isMovieFavorite = () => {
    return favoriteMovies.some((favMovie) => favMovie.id === movie.id);
  };

  // Function to add the movie to the favorite list
  const addToFavorites = async () => {
    if (!isMovieFavorite()) {
      const updatedFavorites = [...favoriteMovies, movie];
      dispatch({ type: 'SET_FAVORITE_MOVIES', payload: updatedFavorites });
      try {
        await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Display the movie poster */}
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }} style={styles.poster} />
      {/* Display the movie title with a star icon if it's in the favorite list */}
      <View style={styles.titleContainer}>
        {isMovieFavorite() && <Icon name="star" size={20} color="red" />}
        <Text style={styles.title}>{movie.title}</Text>
      </View>
      {/* Display movie genres, release date, duration, and average rating */}
      {movie.genres ? (
        <Text style={styles.details}>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</Text>
      ) : (
        <Text style={styles.details}>Genres: Not available</Text>
      )}
      <Text style={styles.details}>Release Date: {movie.release_date}</Text>
      <Text style={styles.details}>Duration: {movie.runtime} minutes</Text>
      <Text style={styles.details}>Average Rating: {movie.vote_average}</Text>
      {/* Display movie overview */}
      <Text style={styles.overview}>{movie.overview}</Text>

      {/* Display "Add to Favorites" or "Remove from Favorites" text based on whether the movie is in the favorite list */}
      <View style={styles.favoriteButtonContainer}>
        {isMovieFavorite() ? (
          <Text style={styles.favoriteText} onPress={addToFavorites}>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
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
});

export default Details;
