import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, ImageBackground, Alert } from 'react-native';
import { auth, db, storage } from './firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

const backgroundGif = { uri: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp" };

export default function ProfileScreen({ navigation, route }) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const roomName = route?.params?.roomName || null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName || '');
          setBio(userData.bio || '');
          setPhotoURL(userData.photoURL || '');
        }
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, []);

  const updateProfile = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        displayName,
        bio,
        photoURL
      });
    }
    navigateToChat();
  };

  const navigateToChat = () => {
    if (roomName) {
      navigation.navigate('Chat', { roomName });
    } else {
      Alert.alert('Error', 'No room selected. Please go back and select a room.');
    }
  };

  const skipProfileSetup = () => {
    navigateToChat();
  };

  const pickProfilePicture = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
        const img = await fetch(selectedImage.uri);
        const bytes = await img.blob();
        await uploadBytes(storageRef, bytes);
        const downloadURL = await getDownloadURL(storageRef);
        setPhotoURL(downloadURL);
      }
    });
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground source={backgroundGif} style={{ flex: 1 }} resizeMode="cover">
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <TouchableOpacity onPress={pickProfilePicture}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white' }}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Display Name"
          placeholderTextColor="#ccc"
          value={displayName}
          onChangeText={setDisplayName}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: 10,
            borderRadius: 10,
            marginTop: 20,
            width: '80%',
          }}
        />
        <TextInput
          placeholder="Bio"
          placeholderTextColor="#ccc"
          value={bio}
          onChangeText={setBio}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: 10,
            borderRadius: 10,
            marginTop: 20,
            width: '80%',
          }}
        />
        <Button title="Update Profile" onPress={updateProfile} />
        <Button title="Skip" onPress={skipProfileSetup} color="gray" />
      </View>
    </ImageBackground>
  );
}
