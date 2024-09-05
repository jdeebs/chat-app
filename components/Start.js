import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

// Import the local image and icon
const backgroundImage = require("../assets/background-image.png");

const Start = ({ navigation }) => {
  // State for changes to name input value
  const [name, setName] = useState("");
  // State for changes to chosen background color
  const [background, setBackground] = useState("");

  // Initialize Firebase authentication handler
  const auth = getAuth();

  // Pass function to onPress of start button
  const signInUser = () => {
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
        Alert.alert("Unable to sign in, please try again.");
      });
  };

  // Set the title of the screen to "Home" only after the component mounts
  useEffect(() => {
    navigation.setOptions({ title: `Home` });
  }, [navigation]);

  return (
    // KeyboardAvoidingView component to handle responsive keyboard behavior on iOS and Android
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
        >
          {/* Render the title */}
          <Text style={styles.title}>Chat App</Text>

          {/* Render the home screen components */}
          <View style={styles.innerContainer}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
            ></TextInput>

            {/* Render the Choose Background Color box */}
            <View style={styles.chooseColorBox}>
              <Text style={styles.chooseColorText}>
                Choose Background Color:
              </Text>
              <View style={styles.colorButtonsContainer}>
                {/* Render the Background Color buttons for each color */}
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="More options"
                  accessibilityHint="Lets you choose to send an image or your geolocation."
                  accessibilityRole="button"
                  style={[
                    styles.chooseColor,
                    { backgroundColor: "#090C08" },
                    background === "#090C08" && styles.selectedColor,
                  ]}
                  // Set the function to handle button press
                  onPress={() => setBackground("#090C08")}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.chooseColor,
                    { backgroundColor: "#474056" },
                    background === "#474056" && styles.selectedColor,
                  ]}
                  onPress={() => setBackground("#474056")}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.chooseColor,
                    { backgroundColor: "#8A95A5" },
                    background === "#8A95A5" && styles.selectedColor,
                  ]}
                  onPress={() => setBackground("#8A95A5")}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.chooseColor,
                    { backgroundColor: "#B9C6AE" },
                    background === "#B9C6AE" && styles.selectedColor,
                  ]}
                  onPress={() => setBackground("#B9C6AE")}
                ></TouchableOpacity>
              </View>
            </View>

            {/* Render the Start Chatting button and run the signInUser function on press */}
            <TouchableOpacity style={styles.button} onPress={signInUser}>
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
    marginTop: 80,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFF",
  },
  innerContainer: {
    flex: 1,
    width: "88%",
    height: "44%",
    marginBottom: 30,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  textInput: {
    width: "88%",
    padding: 15,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    borderWidth: 1,
    borderColor: "#757083",
    opacity: 0.7,
  },
  button: {
    width: "88%",
    height: "20%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#757083",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  chooseColorBox: {
    width: "88%",
    height: "20%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  colorButtonsContainer: {
    width: 30,
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-start",
  },
  chooseColor: {
    width: 40, // Default for non-selected colors
    height: 40, // Default for non-selected colors
    borderRadius: 20,
    marginRight: 15,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#FCD95B",
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    textAlign: "left",
    alignSelf: "flex-start",
  },
});

export default Start;
