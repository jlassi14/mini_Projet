import { combineReducers } from 'redux';

const initialState = {
  movies: [],
  favoriteMovies: [],
};

const moviesReducer = (state = initialState.movies, action) => {
    switch (action.type) {
      case 'SET_MOVIES':
        return action.payload;
      case 'SET_FILTERED_MOVIES': // Add this case to handle the action
        return action.payload;
      default:
        return state;
    }
  };
  
const favoriteMoviesReducer = (state = initialState.favoriteMovies, action) => {
  switch (action.type) {
    case 'SET_FAVORITE_MOVIES':
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  movies: moviesReducer,
  favoriteMovies: favoriteMoviesReducer,
});

export default rootReducer;
