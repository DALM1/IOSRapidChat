import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { auth, db, storage } from './firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

const backgroundGif = { uri: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp" };

export default function ProfileScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDisplayName(userData.displayName || '');
        setBio(userData.bio || '');
        setPhotoURL(userData.photoURL || null);
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, []);

  const updateProfile = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);

    // Préparer un objet de mise à jour
    const updatedFields = {};
    if (displayName) updatedFields.displayName = displayName;
    if (bio) updatedFields.bio = bio;
    if (photoURL) updatedFields.photoURL = photoURL;

    // Si des champs ont été remplis, mise à jour Firestore
    if (Object.keys(updatedFields).length > 0) {
      await updateDoc(userRef, updatedFields);
    }

    navigation.navigate('Chat');
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
      </View>
    </ImageBackground>
  );
}
