import React, { useEffect , useState} from 'react';
import { View, Text, Image, StyleSheet , TouchableOpacity, ImageBackground, ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Portal, Modal, Button , Snackbar  } from 'react-native-paper'; 


const Details = () => {
  // Get the movie object from the route parameters
  const route = useRoute();
  const { movie } = route.params;
  //console.error('moviiiie', movie);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
  const closeConfirmation = () => {
    setShowPopup(false); 
  };
  // Function to add the movie to the favorite list
  const addToFavorites = async () => {
    if (!isMovieFavorite()) {
      const updatedFavorites = [...favoriteMovies, movie];
      dispatch({ type: 'SET_FAVORITE_MOVIES', payload: updatedFavorites });
      try {
        await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
        setShowPopup(true); 
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
        blurRadius={2}
      >
   <View style={styles.imageOverlay} >

        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.detailcontainer}>
              <Text style={styles.details}>Duration: {movie.runtime} minutes</Text>
              <Text style={styles.movieRating}>Average Rating: {movie.vote_average}</Text>
            </View>
            <Text style={styles.Date}>Release Date: {movie.release_date}</Text>
            {movie.genres ? (
              <Text style={styles.Genres}>Genres: {movie.genres.map(genre => genre.name).join(', ')}</Text>
            ) : (
              <View style={styles.favoriteButtonContainer}>
                <Text style={styles.Genres}>Genres: Not available</Text>
              </View>
            )}
          </View>
        </View>

        {/* Display "Add to Favorites" or "Remove from Favorites" text based on whether the movie is in the favorite list */}
        <TouchableOpacity style={styles.heartIconContainer} onPress={addToFavorites}>
          <Icon name={isMovieFavorite() ? 'star' : 'heart'} size={30} color="#FF0000" />
        </TouchableOpacity>

        {/* Add the back button in the top-right corner */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-circle-left" size={30} color="white" />
        </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Display movie overview */}
      <View style={styles.overviewContainer}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>

      <Portal>
        <Modal visible={showPopup} onDismiss={() => setShowPopup(false)} contentContainerStyle={styles.popupContainer}>
          <Text style={styles.popupText}>Le film "<Text style={styles.movieTitle}>{movie?.title}</Text>" a été ajouté aux favoris !</Text>
          <TouchableOpacity  style={styles.actionText} onPress={closeConfirmation}>
              <Text style={styles.OKText}>OK</Text>
            </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
   // fontSize: 16,
   marginTop: 25,
   paddingLeft: '70%',
    //paddingBottom: 35,
  },
  popupContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignSelf: 'center',
    elevation: 5, // For Android shadows
  },
  popupText: {
    color: 'black',
    fontSize: 16,
  },

  
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '75%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the alpha value to control transparency
  },
  posterBackground: {
    width: '100%',
    height: '75%', // Set the background height to 75% of the screen
    //alignItems: 'center',
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
   
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 190,
    justifyContent: 'flex-start', // Align the items to the left
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: 'black',
  },
  OKText: {
    color: 'black',
    fontSize: 16,
    marginHorizontal: 10,
    paddingBottom: 5,
     marginTop: 5,
  },
  title: {
    marginBottom:10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white', 
    marginLeft: 10
    // Add color to the movie title
   // marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    color: 'black',
    borderRadius: 20,
    padding: 8,
  },
  Date: {
    fontSize: 15,
    marginBottom: 5,
    color: 'white',
    marginLeft: 15
  },
  
  Genres: {
    fontSize: 15,
    marginBottom: 5,
    color: 'white',
    marginLeft: 10
  },
  details: {
    fontSize: 15,
    marginBottom: 5,
    color: 'white',
    marginLeft: 15
  },
  
  movieRating: {
    fontSize: 15,
    marginBottom: 5,
    color: 'white',
    marginLeft: 50,
  },
  
  detailcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'black',    // Add border color (you can choose your desired color)

  },
  
  
  detailsValue: {
    fontWeight: 'bold',
    color: 'white', // Add color to the movie details value (e.g., duration, release date, genres)
  },
  overviewContainer: {
    marginTop: -110,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
    borderRadius: 8,
    width: '100%',

    borderWidth: 2,
  borderColor: 'black', 
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
