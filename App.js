import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from "./components/Start";
import Chat from "./components/Chat";

// Create the navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      
      {/* Define the navigation stack */}
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Start Screen" component={Start} />
         {/* Make sure this name matches the one used in navigation.navigate (the Start Chatting button) */}
        <Stack.Screen name="Chat Screen" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
