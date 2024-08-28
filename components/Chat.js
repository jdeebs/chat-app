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
      <Text style={styles.text}>Hello {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
  }
});

export default Chat;
