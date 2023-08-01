import { View, TextInput, Button, StyleSheet, FlatList, Text, Image, Keyboard, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

const Home = () => {
  const API_KEY = 'a2f813058856fd9c644b17c154ceaf1f'; 
  const API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;

  const dispatch = useDispatch();
  const movies = useSelector(state => state.movies);

  useEffect(() => {
    fetchMovies();
  }, []);

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

  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movie });
  };

  const handleSearch = (text) => {
    // Filter movies based on the entered text in the title
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(text.toLowerCase())
    );
    dispatch({ type: 'SET_FILTERED_MOVIES', payload: filtered }); // Dispatch action to update filtered movies
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)}>
      <View style={{ marginBottom: 20, alignItems: 'center' }}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }}
          style={{ width: 200, height: 300 }}
        />
        <Text>{item.title}</Text>
        <Text>Average Rating: {item.vote_average}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Movie"
        onChangeText={handleSearch}
        onSubmitEditing={Keyboard.dismiss} // Close keyboard when pressing enter
      />
      <FlatList
        data={movies} // Use the movies data from the Redux store directly
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
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
    height: 40,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Home;
