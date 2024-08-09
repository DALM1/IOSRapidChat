import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <FlatList
        data={threads}
        renderItem={({ item }) => (
          <View style={styles.threadContainer}>
            <Text style={styles.threadTitle}>{item.data.title}</Text>
            <Text style={styles.threadContent}>{item.data.content}</Text>
            <Text style={styles.threadInfo}>{item.data.displayName || item.data.user} - {new Date(item.data.createdAt.seconds * 1000).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  threadContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  threadTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  threadContent: {
    color: 'white',
    marginTop: 5,
  },
  threadInfo: {
    color: 'gray',
    marginTop: 10,
    fontSize: 12,
  },
});
