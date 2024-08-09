import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { db, auth } from './firebase';
import { addDoc, collection } from "firebase/firestore";

export default function CreateThreadScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const createThread = async () => {
    await addDoc(collection(db, "threads"), {
      title,
      content,
      createdAt: new Date(),
      user: auth.currentUser.email,
      displayName: auth.currentUser.displayName || auth.currentUser.email,
    });
    navigation.navigate('Feed');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={styles.input}
        multiline
      />
      <Button title="Create Thread" onPress={createThread} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
