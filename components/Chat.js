import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

const Chat = ({ route, navigation }) => {
  const { name, background } = route.params;

  // Set the title of the screen to the user's name
  useEffect(() => {
    navigation.setOptions({ title: `${name}` });
  });

  // Render component with dynamic background color passed from Start.js
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text>Hello {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
