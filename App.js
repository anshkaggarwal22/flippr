import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './Screens/LandingPage';
import Signup from './Screens/SignUp';
import Login from './Screens/Login';
import Home from './Screens/Home';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'ProximaNova-Bold': require('./assets/fonts/proximanova_bold.otf'),
        'ProximaNova-Regular': require('./assets/fonts/proximanova_regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="LandingPage"
        screenOptions={{
          headerShown: false, 
        }}
      >
        <Stack.Screen name="LandingPage" component={LandingPage} />
        
        {/* Navigate to Sign Up */}
        <Stack.Screen name="Signup" component={Signup} />
        
        {/* Navigate to Login */}
        <Stack.Screen name="Login" component={Login} />
        
        {/* Navigate to Home after successful login/signup */}
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7EAF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
