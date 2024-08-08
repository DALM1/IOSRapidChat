import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        console.log('User logged in: ', userCredentials.user.email);
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
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate('SignUp')}>Don't have an account? Sign up</Text>
    </View>
  );
}
