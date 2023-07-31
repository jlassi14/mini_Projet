import React from 'react';
import { View } from 'react-native';
import Favourites from '../Components/Favourites';

const FavouritesScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Favourites />
    </View>
  );
};

export default FavouritesScreen;