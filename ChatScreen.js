import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { db, auth } from './firebase';
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [media, setMedia] = useState(null); // State pour stocker l'image/vidéo sélectionnée

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
        media, // Ajoute le media (image/vidéo) au message
        createdAt: new Date(),
        user: auth.currentUser.email
      });
      setMessage('');
      setMedia(null); // Réinitialise le media après l'envoi
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View>
            <Text style={{ color: 'white' }}>{item.data.user}: {item.data.text}</Text>
            {item.data.media && (
              item.data.media.type.startsWith('image/') ? (
                <Image
                  source={{ uri: item.data.media.uri }}
                  style={{ width: 200, height: 200 }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={{ color: 'white' }}>Video sent</Text>
              )
            )}
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <TextInput
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
        style={{
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 5,
          marginHorizontal: 10,
          marginBottom: 5,
        }}
      />

      {media && (
        <View style={{ marginHorizontal: 10, marginBottom: 5 }}>
          <Text style={{ color: 'white' }}>{media.fileName}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <TouchableOpacity onPress={pickMedia}>
          <Text style={{ color: 'blue' }}>Pick Media</Text>
        </TouchableOpacity>

        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}
