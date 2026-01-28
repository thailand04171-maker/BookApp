import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Using Expo icons

// Import your screens
import Main_menu from './Main_menu';
import ScanQR from './ScanQR';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#000000', 
          height: 70, 
          paddingBottom: 10 
        },
        tabBarActiveTintColor: '#D32F2F', // Red from your design
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Main') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'My Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Main" component={Main_menu} />
      <Tab.Screen name="Add" component={ScanQR} />
      <Tab.Screen name="My Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNavigator;