import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
  // Extract userID, name, and background props from the route
  const { userID, name, background } = route.params;
  const [messages, setMessages] = useState([]);

  // Callback function to append new messages to the GiftedChat component using the messages state
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

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

  // Set the messages state with a static message
  useEffect(() => {
    const systemMessage =
      name && name.trim() !== ""
        ? `${name} joined the chat`
        : "A new user joined the chat";

    // Define query to get messages from Firestore
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    // Real-time query listener, When data changes, automatically retrieve updated snapshot of message documents
    const unsubMessages = onSnapshot(q, (snapshot) => {
      let newMessages = [];
      // Iterate through each message document in the snapshot and create a new object with the message data
      snapshot.forEach((doc) => {
        newMessages.push({
          _id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      // Update the messages state with the latest messages
      setMessages(newMessages);
    });

    // Clean up the listener
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  // Set the title of the screen to the user's name or "Chat" if no name is provided
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
