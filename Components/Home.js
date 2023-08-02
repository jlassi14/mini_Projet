// Import required libraries
import { View, TextInput, StyleSheet, FlatList, Text, Image, Keyboard,Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useSelector, useDispatch } from 'react-redux';
import { Searchbar } from 'react-native-paper';
const Home = () => {
  const API_KEY = 'a2f813058856fd9c644b17c154ceaf1f'; 
  const API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;

  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const movies = useSelector(state => state.movies); // Use Redux state for movies

  useEffect(() => {
    fetchMovies();
  }, []);

  // Fetch movies from the API and dispatch action to update movies in Redux
  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      dispatch({ type: 'SET_MOVIES', payload: data.results });
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const navigation = useNavigation();

  // Navigate to the Details screen when a movie is pressed
  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movie });
  };

  // Update the filtered movies in Redux based on the entered text
  const handleSearch = (text) => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(text.toLowerCase())
    );
    dispatch({ type: 'SET_FILTERED_MOVIES', payload: filtered }); // Dispatch action to update filtered movies in Redux
  };

  // Render individual movie items in the FlatList
  const renderMovieItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)}>
    <View style={styles.movieContainer}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
        style={styles.movieImage}
      />
      <View style={styles.movieInfoContainer}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieRating}>Average Rating: {item.vote_average}</Text>
      </View>
    </View>
  </TouchableOpacity>
  );

  return (
   
    <View style={styles.container}>
      {/* Heart icon */}
      <View style={styles.heartIconContainer}>
        <TouchableOpacity  onPress={() =>  navigation.navigate('Favourites')}>
          <Icon name="heart" size={24} color="#FF1493" />
        </TouchableOpacity>
      </View>

      {/* Search input */}
      <TextInput
        style={styles.input}
        placeholder="Search Movie"
        placeholderTextColor="#888"
        onChangeText={handleSearch}
        onSubmitEditing={Keyboard.dismiss} // Close keyboard when pressing enter
      />
      {/* Movie list */}
      <FlatList
      contentContainerStyle={{padding:30}}
      horizontal={false}
      numColumns={2}
        data={movies} // Use the movies data from the Redux store directly
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
       // contentContainerStyle={{ padding: 20 }}
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 24,
    paddingLeft: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
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
    marginLeft:10,
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
  rowContainer: {
    justifyContent: 'space-between', // Add space between images
    marginBottom: 20,
    width: '100%', // Set the width of the row container to 100%
  },
});

export default Home;
