import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ImageBackground } from 'react-native';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";



export default function FeedScreen() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setThreads(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })));
    });

    return unsubscribe;
  }, []);

  return (
    <ImageBackground source={{ uri: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp' }} style={{ flex: 1 }} resizeMode="cover">
      <FlatList
        data={threads}
        renderItem={({ item }) => (
          <View style={{
            marginVertical: 10,
            marginHorizontal: 15,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 20,
            padding: 15
          }}>
            <Text style={{ color: 'white' }}>{item.data.content}</Text>
            <Text style={{ color: 'gray', marginTop: 10, fontSize: 12 }}>
              {new Date(item.data.createdAt.toDate()).toLocaleString()}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </ImageBackground>
  );
}
