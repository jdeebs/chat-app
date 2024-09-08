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
  where,
} from "firebase/firestore";

// Async Storage for Data Caching
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom Actions Component
import CustomActions from "./CustomActions";

const Chat = ({ db, route, navigation, isConnected }) => {
  // Extract userID, name, and background props from the route
  const { userID, name, background } = route.params;
  const [messages, setMessages] = useState([]);

  // Append new messages to the GiftedChat component using the messages state
  const onSend = (newMessages) => {
    // Takes 2 props (collection reference, data to add) then adds data (new message document) to Firestore db
    addDoc(collection(db, "messages"), newMessages[0]);
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

  // Conditionally render the input toolbar based on network connectivity
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // Subscribe to Firestore updates (real-time) or load cached messages when offline
  let unsubMessages;
  useEffect(() => {
    if (isConnected === true) {
      // Clean up existing listener
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // Define query to get messages from Firestore
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      where("_id", "==", userID);
      // Retrieve updated snapshot of message documents
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

  // Cache messages in AsyncStorage for offline use
  const cacheMessages = async (messagesToCache) => {
    try {
      // Create cached message object with the key "messages" and the messages array
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Load cached messages from AsyncStorage when offline
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

  // Set the screen title to the user's name or default to "Chat"
  useEffect(() => {
    if (name && name.trim() !== "") {
      navigation.setOptions({ title: `${name}'s Chat` });
    } else {
      navigation.setOptions({ title: "Chat" });
    }
  }, [name, navigation]);

  // Render component with dynamic background color passed from Start.js
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      ></KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
