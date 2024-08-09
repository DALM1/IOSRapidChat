import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { db, auth } from './firebase';
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';

const backgroundGif = { uri: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp" };

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [media, setMedia] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })));
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (message.trim() || media) {
      await addDoc(collection(db, "messages"), {
        text: message,
        media,
        createdAt: new Date(),
        user: auth.currentUser.email
      });
      setMessage('');
      setMedia(null);
    }
  };

  const pickMedia = () => {
    launchImageLibrary({ mediaType: 'mixed' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedMedia = response.assets[0];
        setMedia({
          uri: selectedMedia.uri,
          type: selectedMedia.type,
          fileName: selectedMedia.fileName,
        });
      }
    });
  };

  return (
    <ImageBackground source={backgroundGif} style={{ flex: 1 }} resizeMode="cover">
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={{
            marginVertical: 10,
            marginHorizontal: 15,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 20,
            padding: 15
          }}>
            <Text style={{ color: 'white', marginBottom: 10 }}>
              {item.data.user}: {item.data.text}
            </Text>
            {item.data.media && (
              item.data.media.type.startsWith('image/') ? (
                <Image
                  source={{ uri: item.data.media.uri }}
                  style={{ width: 220, height: 220, borderRadius: 15 }}
                  resizeMode="cover"
                />
              ) : item.data.media.type.startsWith('video/') ? (
                <Video
                  source={{ uri: item.data.media.uri }}
                  style={{ width: 220, height: 220, borderRadius: 15 }}
                  resizeMode="cover"
                  controls={true}
                />
              ) : null
            )}
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <TextInput
        placeholder="Type a message"
        placeholderTextColor="#ccc"
        value={message}
        onChangeText={setMessage}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: 10,
          borderRadius: 10,
          marginHorizontal: 15,
          marginBottom: 10,
        }}
      />

      {media && (
        <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
          <Text style={{ color: 'white' }}>{media.fileName}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
        <TouchableOpacity onPress={pickMedia}>
          <Text style={{ color: 'blue' }}>Pick Media</Text>
        </TouchableOpacity>

        <Button title="Send" onPress={sendMessage} />
      </View>
    </ImageBackground>
  );
}
