// React & React Native Core Components & APIs
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Button,
  Platform,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";

// Firebase Authentication Module
import { getAuth, signInAnonymously } from "firebase/auth";

// Icon Library
import { Ionicons } from "@expo/vector-icons";

// Local Assets
const backgroundImage = require("../assets/start-background.jpg");

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [background, setBackground] = useState("");
  const colors = ["#EEF1FF", "#D2DAFF", "#AAC4FF", "#B1B2FF"];

  // Initialize Firebase authentication handler
  const auth = getAuth();

  // Pass function to onPress of start button
  const signInUser = () => {
    // Check if name has at least 3 characters
    if (name.length < 3) {
      Alert.alert("Name must be at least 3 characters long.");
      return;
    }
    // Passes auth user info
    signInAnonymously(auth)
      // result is a returned information object, includes temporary user account info
      .then((result) => {
        navigation.navigate("Chat Screen", {
          userID: result.user.uid,
          name: name,
          background: background,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        console.error("Error signing in:", error.message);
        Alert.alert("Unable to sign in, please try again.");
      });
  };

  // Set screen title to "Home" after component mounts
  useEffect(() => {
    navigation.setOptions({ title: `Home` });
  }, [navigation]);

  return (
    // Handle responsive keyboard behavior on iOS and Android
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Dismiss keyboard when touching outside input */}
      <Pressable
        style={styles.pressable}
        onPress={Keyboard.dismiss}
        // Ensure Pressable does not interfere with other components' touch events
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        {/* Render the background image */}
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.6 }}
        >
          {/* Render the title */}
          <Text style={styles.title}>Chat App</Text>

          {/* Render the home screen components */}
          <View style={styles.innerContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name here"
                placeholderTextColor="#757083"
                caretHidden={true}
              />

              <Ionicons
                name="person"
                size={24}
                color="#E0E0E0"
                style={styles.inputIcon}
              />
            </View>

            <Text style={styles.innerContainerLabel}>
              Choose a color for your chat theme
            </Text>
            {/* Render the Choose Background Color box */}
            <View>
              <View style={styles.colorPicker}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      background === color && styles.selectedColor,
                    ]}
                    onPress={() => setBackground(color)}
                  />
                ))}
              </View>
            </View>

            {/* Render the Start Chatting button and run the signInUser function on press */}
            <TouchableOpacity
              accessibilityLabel="Start Chatting"
              accessibilityHint="Navigates to the chat screen"
              accessibilityRole="button"
              style={styles.button}
              onPress={signInUser}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressable: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    justifyContent: "center",
    marginTop: 65,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFF",
  },
  innerContainer: {
    width: "88%",
    height: "44%",
    padding: 20,
    marginBottom: 30,
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#565264",
    opacity: 0.95,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "88%",
    maxHeight: "25%",
    height: "25%",
    backgroundColor: "#B1B2FF",
    borderRadius: 10,
    marginBottom: 20,
  },
  textInput: {
    width: "88%",
    paddingLeft: 10,
    fontSize: 22,
    fontWeight: "400",
    color: "#000",
  },
  button: {
    width: "88%",
    height: "20%",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8C547",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#000",
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    opacity: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 6,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#E8C547",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  innerContainerLabel: {
    fontSize: 18,
    fontWeight: "400",
    color: "#fff",
    textAlign: "center",
  },
});

export default Start;
