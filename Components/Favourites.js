import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

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
      <View style={styles.movieContainer}>

        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
          style={styles.movieImage}

        />

        <TouchableOpacity onPress={() => navigation.navigate('Favourites')}>
          <Icon name="minus-circle" style={styles.heartIcon} size={30} color="#FF0000" onPress={() => removeFromFavorites(item)} />
        </TouchableOpacity>
        <View style={styles.movieInfoContainer}>

          <Text>{item.title}</Text>
          <Text>Average Rating: {item.vote_average}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* FlatList to render favorite movie items */}
      <FlatList
        contentContainerStyle={{ padding: 30 }}
        horizontal={false}
        numColumns={2}
        data={favoriteMovies} // Use the favoriteMovies data from Redux store directly
        renderItem={renderFavoriteMovieItem}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.rowContainer}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,

  },
  heartIcon: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: -145,
    marginLeft: 115,


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
  heartIconContainer: {
    flexDirection: 'row', // Stack icon and search bar vertically
    justifyContent: 'flex-end', // Align the icon to the right
    alignItems: 'center', // Center the icon vertically
    marginBottom: 16, // Add some margin between icon and search bar
  },
  movieContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  movieImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  movieInfoContainer: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  movieRating: {
    fontSize: 14,
    color: '#888',
  },
  removeButton: {
    color: 'red',
    marginTop: 5,
  },
  rowContainer: {
    justifyContent: 'space-between', // Add space between images
    marginBottom: 20,
    width: '100%', // Set the width of the row container to 100%
  },
});

export default Favorites;
