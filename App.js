import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './Screens/HomeScreem';

const Stack = createStackNavigator();

function App() {
 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' >
        <Stack.Screen name="Home" component={HomeScreen} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
