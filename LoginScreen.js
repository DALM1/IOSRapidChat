import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
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
    <ImageBackground
      source={{ uri: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="lightgray"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="lightgray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text onPress={() => navigation.navigate('SignUp')} style={styles.signupLink}>
            Sign up
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Pour assombrir légèrement le fond et améliorer la lisibilité
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  signupText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: 'lightblue',
    fontWeight: 'bold',
  },
});
