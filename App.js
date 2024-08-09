import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import CreateThreadScreen from './CreateThreadScreen';
import FeedScreen from './FeedScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="CreateThread" component={CreateThreadScreen} options={{ title: 'Create Thread' }} />
        <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Feed' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
