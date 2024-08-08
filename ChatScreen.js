import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
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
    <ImageBackground
      source={{ uri: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.userText}>{item.data.user}</Text>
              <Text style={styles.messageText}>{item.data.text}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
          style={styles.messageList}
          inverted
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message"
            placeholderTextColor="lightgray"
            value={message}
            onChangeText={setMessage}
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  userText: {
    color: 'lightblue',
    fontWeight: 'bold',
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
