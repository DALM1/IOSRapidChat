import React, { useState } from 'react';
import { View, TextInput, Button, ImageBackground } from 'react-native';
import { db, auth } from './firebase';
import { collection, addDoc } from "firebase/firestore";



export default function CreateThreadScreen({ navigation }) {
  const [content, setContent] = useState('');

  const createThread = async () => {
    if (content.trim()) {
      await addDoc(collection(db, 'threads'), {
        content,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      setContent('');
      navigation.navigate('Feed');
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp' }} style={{ flex: 1 }} resizeMode="cover">
      <View style={{ padding: 20 }}>
        <TextInput
          placeholder="Write your thread..."
          placeholderTextColor="#ccc"
          value={content}
          onChangeText={setContent}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: 10,
            borderRadius: 10,
            marginBottom: 20,
            height: 150,
            textAlignVertical: 'top',
          }}
          multiline={true}
        />
        <Button title="Post Thread" onPress={createThread} />
      </View>
    </ImageBackground>
  );
}
