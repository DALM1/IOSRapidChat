import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { db, auth } from './firebase';
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const backgroundGif = { uri: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp" };

const defaultProfileImage = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3I5ODY0aTZhanl6MWNzMXVxemhnbmVxZnhheXJ3OHJ5cTlsdjZwZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xaZCqV4weJwHu/giphy.webp';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [media, setMedia] = useState(null);
  const navigation = useNavigation();

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
        user: auth.currentUser.email,
        displayName: auth.currentUser.displayName || auth.currentUser.email,
        photoURL: auth.currentUser.photoURL || defaultProfileImage,
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

  const renderMessage = ({ item }) => {
    const isImage = item.data.media && item.data.media.type.startsWith('image/');
    const isVideo = item.data.media && item.data.media.type.startsWith('video/');
    const formattedDate = new Date(item.data.createdAt.seconds * 1000).toLocaleString();

    return (
      <View style={styles.messageContainer}>
        <Image source={{ uri: item.data.photoURL || defaultProfileImage }} style={styles.profileImage} />
        <View style={styles.messageContent}>
          <Text style={styles.displayName}>{item.data.displayName}</Text>
          <Text style={styles.messageText}>{item.data.text}</Text>
          {isImage && (
            <Image source={{ uri: item.data.media.uri }} style={styles.media} resizeMode="cover" />
          )}
          {isVideo && (
            <Video source={{ uri: item.data.media.uri }} style={styles.media} resizeMode="cover" controls={true} />
          )}
          <Text style={styles.messageDate}>{formattedDate}</Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={backgroundGif} style={{ flex: 1 }} resizeMode="cover">
      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navigationText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreateThread')}>
          <Text style={styles.navigationText}>Create Thread</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Feed')}>
          <Text style={styles.navigationText}>Feed</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
      />

      <TextInput
        placeholder="Type a message"
        placeholderTextColor="#ccc"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />

      {media && (
        <View style={styles.mediaInfoContainer}>
          <Text style={styles.mediaInfoText}>{media.fileName}</Text>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={pickMedia}>
          <Text style={styles.pickMediaText}>Pick Media</Text>
        </TouchableOpacity>

        <Button title="Send" onPress={sendMessage} />
      </View>
    </ImageBackground>
  );
}

const styles = {
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  navigationText: {
    color: 'white',
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',  // Center the content vertically
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  displayName: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    color: 'white',
    marginBottom: 5,
  },
  media: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  messageDate: {
    color: 'gray',
    fontSize: 12,
    marginTop: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  mediaInfoContainer: {
    marginHorizontal: 10,
    marginBottom: 5,
  },
  mediaInfoText: {
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  pickMediaText: {
    color: 'blue',
  },
};
