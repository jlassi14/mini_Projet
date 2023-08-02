import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet , TouchableOpacity, ImageBackground, ScrollView} from 'react-native';
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
     
      {/* Image background (cover image) */}
      <ImageBackground
        source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.poster_path}` }}
        style={styles.posterBackground}
        blurRadius={3}
      >
        {/* Display the movie title with a star icon if it's in the favorite list */}
        <View style={styles.titleContainer}>
          {isMovieFavorite() && <Icon name="star" size={20} color="red" />}
          <View>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.details}>Duration: {movie.runtime} minutes</Text>
            <Text style={styles.details}>Release Date: {movie.release_date}</Text>
            {movie.genres ? (
              <Text style={styles.details}>Genres: {movie.genres.map((genre) => genre.name).join(', ')}</Text>
            ) : (
              

              <View  style={styles.favoriteButtonContainer}>
              <Text style={styles.details}>Genres: Not available</Text>
              </View>
            )}
          </View>
        </View>
  
        {/* Display "Add to Favorites" or "Remove from Favorites" text based on whether the movie is in the favorite list */}
        <TouchableOpacity style={styles.heartIconContainer} onPress={addToFavorites}>
        <Icon name={isMovieFavorite() ? 'heart' : 'heart-outline'} size={30} color="#FF0000" />
      </TouchableOpacity>
      </ImageBackground>
  
      {/* Display movie overview */}
     

      <View style={styles.overviewContainer}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
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
  posterBackground: {
    width: '100%',
    height: '75%', // Set the background height to 75% of the screen
    alignItems: 'center',
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
   
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 140,
    justifyContent: 'center', // Center the text horizontally
  },
  title: {
    marginBottom:10,
    fontSize: 29,
    fontWeight: 'bold',
    color: 'white', // Add color to the movie title
   // marginLeft: 10,
  },
  details: {
    fontSize: 20,
    marginBottom: 5,
    color: 'white', // Add color to the movie details text
   // fontWeight: 'bold',
  },
  detailsValue: {
    fontWeight: 'bold',
    color: 'white', // Add color to the movie details value (e.g., duration, release date, genres)
  },
  overviewContainer: {
    marginTop: -90,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
    borderRadius: 8,
    width: '100%',
  },
  overviewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: 'black',
  },
  overview: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },

  favoriteButtonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the button
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    width:230,
    marginTop:10
  },
  favoriteText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
   // backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
});



export default Details;
