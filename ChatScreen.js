import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { db, auth } from './firebase';
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

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

  const sendMessage = () => {
    if (message.trim()) {
      addDoc(collection(db, "messages"), {
        text: message,
        createdAt: new Date(),
        user: auth.currentUser.email
      });
      setMessage('');
    }
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View>
            <Text>{item.data.user}: {item.data.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TextInput
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
