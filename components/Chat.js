// React & React Native Core Components & APIs
import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";

// Gifted Chat Components
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";

// Firebase Firestore Modules
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// Async Storage for Data Caching
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, navigation }) => {
  // Extract userID, name, and background props from the route
  const { userID, name, background } = route.params;
  const [messages, setMessages] = useState([]);

  // Function to append new messages to the GiftedChat component using the messages state
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Function to conditionally render the input toolbar based on network connectivity
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Custom rendering for message bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  // Effect to listen to real-time updates from Firestore
  let unsubMessages;
  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // Define query to get messages from Firestore
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      where("_id", "==", userID);
      // When data changes, automatically retrieve updated snapshot of message documents
      unsubMessages = onSnapshot(q, (snapshot) => {
        let newMessages = [];
        // Iterate through each message document in the snapshot
        snapshot.forEach((doc) => {
          // Create new object with the message data and add it to the newMessages array
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        // Cache messages in AsyncStorage
        cacheMessages(newMessages);
        // Update messages with Firestore
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Unregister listener to prevent duplicated listeners (memory leaks) when component re-renders
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  // Function to cache messages in AsyncStorage for offline use
  const cacheMessages = async (messagesToCache) => {
    try {
      // Create cached message object with the key "messages" and the messages array
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to load cached messages from AsyncStorage when offline
  const loadCachedMessages = async () => {
    try {
      // Retrieve cached messages from AsyncStorage
      const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
      // Parse the cached messages back into an array and update the messages state
      setMessages(JSON.parse(cachedMessages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Effect to update the screen title with the user's name
  useEffect(() => {
    // Set the title of the screen to the user's name or "Chat" if no name is provided
    if (name && name.trim() !== "") {
      navigation.setOptions({ title: `${name}'s Chat` });
    } else {
      navigation.setOptions({ title: "Chat" });
    }
  }, [name, navigation]); // Update when name or nav changes

  // Render component with dynamic background color passed from Start.js
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === "android" || Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="height" style={styles.iosKeyboard} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iosKeyboard: {
    // Conditional padding for iOS
    paddingBottom: Platform.OS === "ios" ? 34 : 0,
  },
});

export default Chat;
