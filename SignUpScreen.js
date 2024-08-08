import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        console.log('User signed up: ', userCredentials.user.email);
        navigation.navigate('Chat');
      })
      .catch(error => console.error(error.message));
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text onPress={() => navigation.navigate('Login')}>Already have an account? Log in</Text>
    </View>
  );
}
