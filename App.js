import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from './Components/Welcome';
import Login from './Components/Login';
import Sign_in from './Components/Sign_in';
import OTP from './Components/OTP';
import Search from './Components/Search';
import AddbyCode from './Components/AddbyCode';
import Book_Decs from './Components/Book_Decs';
import Reader from './Components/Reader';
// Import the TabNavigator we just made
import TabNavigator from './Components/TabNavigator'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Sign_in" component={Sign_in} />
        <Stack.Screen name="OTP" component={OTP} />        
        {/* Main App - This contains the Bottom Tabs */}
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="AddbyCode" component={AddbyCode} />
        <Stack.Screen name="Reader" component={Reader} />
        {/* Search is usually a full-screen stack, not a tab */}
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Book_Decs" component={Book_Decs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}