import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Image, ImageBackground } from 'react-native';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from './firebase';
import Dialog from 'react-native-dialog';
import { useNavigation } from '@react-navigation/native';

const backgroundGif = { uri: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZjZXo3Ym02bXloa25rMWQ2NWx6NHE5MDM5ZmNmNWJxeWN0ZHNiMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w4E7xK8UM9ZeY1ksDa/giphy.webp" };
const logo = require('./assets/rapidchat-logo-based.png'); // Importation du logo

export default function RoomScreen() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // État pour la recherche
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsCollection = await getDocs(collection(db, "rooms"));
      setRooms(roomsCollection.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })));
    } catch (error) {
      console.error("Error fetching rooms: ", error);
    }
  };

  const createRoom = async () => {
    if (roomName.trim()) {
      try {
        await addDoc(collection(db, "rooms"), {
          name: roomName,
          password: roomPassword,
          createdBy: auth.currentUser.uid,
        });
        setRoomName('');
        setRoomPassword('');
        fetchRooms(); // Actualiser la liste des rooms après la création
      } catch (error) {
        console.error("Error creating room: ", error);
      }
    } else {
      Alert.alert('Error', 'Room name is required');
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      await deleteDoc(doc(db, "rooms", roomId));
      fetchRooms(); // Actualiser la liste après la suppression
    } catch (error) {
      console.error("Error deleting room: ", error);
      Alert.alert("Error", "Could not delete the room");
    }
  };

  const joinRoom = (room) => {
    if (room.password) {
      setSelectedRoom(room);
      setIsDialogVisible(true);
    } else {
      navigation.navigate('Chat', { roomName: room.name });
    }
  };

  const handlePasswordSubmit = () => {
    if (enteredPassword === selectedRoom.password) {
      setIsDialogVisible(false);
      setEnteredPassword("");
      navigation.navigate('Chat', { roomName: selectedRoom.name });
    } else {
      Alert.alert("Error", "Incorrect password");
    }
  };

  // Filtrage des rooms en fonction de la recherche
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground source={backgroundGif} style={styles.background}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <TextInput
          placeholder="Room Name"
          value={roomName}
          onChangeText={setRoomName}
          style={styles.input}
          placeholderTextColor="#ccc"
        />
        <TextInput
          placeholder="Room Password (Optional)"
          value={roomPassword}
          onChangeText={setRoomPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity onPress={createRoom}>
          <Text style={styles.createRoomButton}>Create Room</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Search Rooms..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
          placeholderTextColor="#ccc"
        />

        <Text style={styles.availableRoomsTitle}>Available Rooms</Text>
        {filteredRooms.map((room, index) => (
          <View key={index} style={styles.roomItemContainer}>
            <TouchableOpacity onPress={() => joinRoom(room)} style={styles.roomItem}>
              <Text style={styles.roomName}>{room.name}</Text>
            </TouchableOpacity>
            {room.createdBy === auth.currentUser.uid && ( // Afficher le bouton de suppression si l'utilisateur a créé la room
              <TouchableOpacity onPress={() => deleteRoom(room.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <Dialog.Container visible={isDialogVisible}>
          <Dialog.Title>Enter Password</Dialog.Title>
          <Dialog.Input
            secureTextEntry
            value={enteredPassword}
            onChangeText={setEnteredPassword}
          />
          <Dialog.Button label="Cancel" onPress={() => setIsDialogVisible(false)} />
          <Dialog.Button label="OK" onPress={handlePasswordSubmit} />
        </Dialog.Container>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  createRoomButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  availableRoomsTitle: {
    color: 'white',
    fontSize: 20,
    marginVertical: 20,
  },
  roomItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  roomItem: {
    flex: 1,
  },
  roomName: {
    color: 'white',
    fontSize: 18,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
