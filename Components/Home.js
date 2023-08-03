import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { Searchbar } from 'react-native-paper';

const Home = () => {
  const API_KEY = 'a2f813058856fd9c644b17c154ceaf1f';
  const API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;

  const dispatch = useDispatch(); 
  const movies = useSelector((state) => state.movies); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
   
  }, []);

  // Fetch movies from the API and dispatch action to update movies in Redux
  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      dispatch({ type: 'SET_MOVIES', payload: data.results });
      console.log('datadatadata', data);
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
  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length === 0) {
      // If search query is empty, display all movies
      setFilteredMovies([]);
    } else {
      // Filter the top-rated movies based on the entered text
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(text.toLowerCase())
      );
      // Update the filtered movies in local state
      setFilteredMovies(filtered);
    }
  };
  // Function to clear the search and display all movies
  const clearSearch = () => {
    setSearchQuery('');
    dispatch({ type: 'SET_FILTERED_MOVIES', payload: movies }); 
  };

  // Render individual movie items in the FlatList
  const renderMovieItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)}>
      <View style={styles.movieContainer}>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }} style={styles.movieImage} />
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
        <TouchableOpacity onPress={() => navigation.navigate('Favourites')}>
          <Icon name="heart" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>

      {/* Searchbar */}
      <Searchbar
        style={styles.searchBar}
        placeholder="Search Movie"
        placeholderTextColor="#888"
        onChangeText={handleSearch}
        value={searchQuery}
        onIconPress={clearSearch} // Clear the search when the search icon is pressed
      />

      {/* Movie list */}
      <FlatList
        contentContainerStyle={{ padding: 30 }}
        horizontal={false}
        numColumns={2}
        data={searchQuery.length === 0 ? movies : filteredMovies} // Use the movies data from the Redux store directly
        renderItem={renderMovieItem}
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
        padding: 2,
  },
  searchBar: {
    height: 48,
    backgroundColor: '#fff',
  },
  heartIconContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginBottom: 16, 
    margin: 10,

  },
  movieContainer: {
    margin: 10,
  },
  movieImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  
  },
  movieInfoContainer: {
    
    width: 150
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
    color: 'black',
  },
  movieRating: {
    fontSize: 14,
    color: 'black',
  },
  rowContainer: {
    justifyContent: 'space-between',  
    marginBottom: 0,
    width: '100%',
    justifyContent: 'center',
  },
});

export default Home;
