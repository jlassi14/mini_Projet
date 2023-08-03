import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper'; // Import Provider from react-native-paper
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './redux/store'; 
import HomeScreen from './Screens/HomeScreem';
import DetailsScreen from './Screens/DetailsScreen';
import FavouritesScreen from './Screens/FavouritesScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      {/* Add PaperProvider */}
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Favourites" component={FavouritesScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

export default App;
