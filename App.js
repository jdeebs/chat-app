import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";

// Create the navigator
const Stack = createNativeStackNavigator();

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyAc3zlMx2mt3ASOg6YvfSwqVi5V-TrrePM",
    authDomain: "chat-app-fd428.firebaseapp.com",
    projectId: "chat-app-fd428",
    storageBucket: "chat-app-fd428.appspot.com",
    messagingSenderId: "98351051865",
    appId: "1:98351051865:web:c5ade7ed8de1398dde2d48"
  };

  // Initialize Firebase, Cloud Firestore and get a reference to the database
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      
      {/* Define the navigation stack */}
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Start Screen" component={Start} />
         {/* Ensure this name matches the one used in navigation.navigate (the Start Chatting button) */}
        <Stack.Screen name="Chat Screen">
        {/* Functional component renders the Chat component, passing the Firestore database reference as a prop */}
        {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
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
