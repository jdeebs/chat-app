// React & React Native Core Components & APIs
import { useEffect } from "react";
import { StyleSheet, Alert } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

// React Navigation Modules
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Network Information Hook
import { useNetInfo } from "@react-native-community/netinfo";

// Firebase Core & Firestore Modules
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";

// App Screens
import Start from "./components/Start";
import Chat from "./components/Chat";

// Create the stack navigator
const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAc3zlMx2mt3ASOg6YvfSwqVi5V-TrrePM",
    authDomain: "chat-app-fd428.firebaseapp.com",
    projectId: "chat-app-fd428",
    storageBucket: "chat-app-fd428.appspot.com",
    messagingSenderId: "98351051865",
    appId: "1:98351051865:web:c5ade7ed8de1398dde2d48",
  };

  // Initialize Firebase, Cloud Firestore and get a reference to the database
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Define new state for network connectivity status
  const connectionStatus = useNetInfo();

  // Alert if connection is lost and disable Firestore db reconnect attempts until connection is re-established
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        {/* Define the navigation stack */}
        <Stack.Navigator initialRouteName="Screen1">
          <Stack.Screen name="Start Screen" component={Start} />
          {/* Ensure this name matches the one used in navigation.navigate (the Start Chatting button) */}
          <Stack.Screen name="Chat Screen">
            {/* Functional component renders the Chat component, passing the Firestore database reference as a prop */}
            {(props) => (
              <Chat
                isConnected={connectionStatus.isConnected}
                db={db}
                {...props}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
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

export default App;