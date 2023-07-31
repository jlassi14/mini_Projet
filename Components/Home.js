import { View, TextInput, Button, StyleSheet, FlatList, Text, Image, Keyboard, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute , useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  //const navigation = useNavigation();
  const API_KEY = 'a2f813058856fd9c644b17c154ceaf1f'; 
  const API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMovies(data.results);
      setFilteredMovies(data.results); // Initialize filteredMovies with all movies
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const navigation = useNavigation(); // Initialize useNavigation hook
  const handleMoviePress = (movie) => {
    // Navigate to the Detail screen and pass the movie object as a parameter
    navigation.navigate('Details',  { movie });
  };

  const handleSearch = (text) => {
    // Filter movies based on the entered text in the title
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMovies(filtered);
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
        data={filteredMovies}
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
