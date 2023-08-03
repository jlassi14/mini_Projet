import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dialog, Portal, Button, Modal } from 'react-native-paper';

const Favorites = () => {
  const navigation = useNavigation();
  const favoriteMovies = useSelector(state => state.favoriteMovies);
  const dispatch = useDispatch();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    loadFavoriteMovies();
  }, []);

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

  const removeFromFavorites = async (movie) => {
    try {
      const updatedFavorites = favoriteMovies.filter((favMovie) => favMovie.id !== movie.id);
      await AsyncStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
      dispatch({ type: 'SET_FAVORITE_MOVIES', payload: updatedFavorites });
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movie });
  };

  const openConfirmation = (movie) => {
    console.log("minus icon clicked ")
    setSelectedMovie(movie);
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setSelectedMovie(null);
    setShowConfirmation(false);
  };

  const renderFavoriteMovieItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)}>
      <View style={styles.movieContainer}>
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}` }} style={styles.movieImage} />
        <TouchableOpacity style={styles.heartIcon} onPress={() => openConfirmation(item)}>
          <Icon name="minus-circle" style={styles.heartIcon1} size={30} color="#FF0000" />
        </TouchableOpacity>
        <View style={styles.movieInfoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.average}>Average Rating: {item.vote_average}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    {favoriteMovies.length === 0 ? (
      <Text style={styles.emptyText}>Aucun film favori pour le moment.</Text>
    ) : (
      /* FlatList to render favorite movie items */
      <FlatList
        contentContainerStyle={{ padding: 30 }}
        horizontal={false}
        numColumns={2}
        data={favoriteMovies}
        renderItem={renderFavoriteMovieItem}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.rowContainer}
      />
    )}
      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={showConfirmation} onDismiss={closeConfirmation} contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Confirmation</Text>
          <Text style={styles.modalText}>
            Êtes-vous sûr de vouloir supprimer "<Text style={styles.movieTitle}>{selectedMovie?.title}</Text>" de vos favoris ?
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={closeConfirmation}>
              <Text style={[styles.actionText, styles.annulerText]}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { removeFromFavorites(selectedMovie); closeConfirmation(); }}>
              <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 6,

  },
  heartIcon: {
    fontSize: 15,
    fontWeight: 'bold',
    width: 30,
    height: 30,
    marginTop: -145,
    marginLeft: 115,


  },
  emptyText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
    color: 'gray',
  },

  movieTitle: {
    fontWeight: 'bold', // Make the movie title bold
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
    marginTop: 120,
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 10,
    width: 150 ,
    textShadowColor: 'black',

    


  },
  title: {
    
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: 'black',  },  
  average: {
    
    fontSize: 14,
    color: '#888',  },


  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: 'black',

    
  },
  movieRating: {
    fontSize: 14,
    color: 'black',
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

  modal: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    color: 'black',

  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 
    30,
    color: 'black',

    
  },
  movieTitle: {
    fontWeight: 'bold', 
    color: 'gray',
    // Make the movie title bold
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 16,
    marginHorizontal: 10,
    paddingBottom: 15,
  },
  deleteText: {
    color: 'red',
  },

  annulerText: {
    color: 'black',
  },
});

export default Favorites;
