import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
  const { name, background } = route.params;
  const [messages, setMessages] = useState([]);

  // Callback function to append new messages to the GiftedChat component using the messages state
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
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

    setMessages([
      {
        _id: 1,
        // If no name, use "there" as a placeholder
        text: `Hello ${name || "there"}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: systemMessage,
        createdAt: new Date(),
        system: true,
      },
    ]);
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
          _id: 1,
        }}
        style={{ flex: 1 }}
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
