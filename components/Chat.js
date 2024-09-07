// React & React Native Core Components & APIs
import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";

// Gifted Chat Components
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// Firebase Firestore Modules
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
  // Extract userID, name, and background props from the route
  const { userID, name, background } = route.params;
  const [messages, setMessages] = useState([]);

  // Function to append new messages to the GiftedChat component using the messages state
  const onSend = (newMessages) => {
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

  // Effect to listen to real-time updates from Firestore
  useEffect(() => {
    // Define query to get messages from Firestore
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    // When data changes, automatically retrieve updated snapshot of message documents
    const unsubMessages = onSnapshot(q, (snapshot) => {
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
      // Update messages with Firestore messages
      setMessages(newMessages);
    });

    // Clean up the listener
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

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
