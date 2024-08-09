import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, ImageBackground } from 'react-native';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const backgroundGif = { uri: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp" };

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Rooms');
    } catch (error) {
      Alert.alert('Login error', error.message);
    }
  };

  return (
    <ImageBackground source={backgroundGif} style={{ flex: 1 }} resizeMode="cover">
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
          }}
        />
        <Button title="Login" onPress={handleLogin} />
        <Text
          onPress={() => navigation.navigate('SignUp')}
          style={{ color: 'white', textAlign: 'center', marginTop: 20 }}
        >
          Don't have an account? Sign up
        </Text>
      </View>
    </ImageBackground>
  );
}
