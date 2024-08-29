import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, background } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

  // Set the messages state with a static message
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello ${name}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
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
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        style={{ flex: 1}}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
