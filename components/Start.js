import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Import the local image
const backgroundImage = require("../assets/background-image.png");

const Start = ({ navigation }) => {
  // State for changes to name input value
  const [name, setName] = useState("");
  // State for changes to chosen background color
  const [background, setBackground] = useState("");

  return (
    // KeyboardAvoidingView component to handle responsive keyboard behavior on iOS and Android
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Render the background image */}
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        {/* Render the title */}
        <Text style={styles.title}>Chat App</Text>

        {/* Render the Start screen components */}
        <View style={styles.innerContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          ></TextInput>

          {/* Render the Choose Background Color box */}
          <View style={styles.chooseColorBox}>
            <Text style={styles.chooseColorText}>Choose Background Color:</Text>
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

          {/* Render the Start Chatting button and pass the name and background values in navigation call */}
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("Chat Screen", {
                name: name,
                background: background,
              })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
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
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 30,
    width: "88%",
    height: "44%",
    backgroundColor: "#FFF",
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "300",
    fontColor: "#757083",
    borderColor: "#757083",
    opacity: 0.5,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "88%",
    height: "20%",
    padding: 10,
    fontSize: 16,
    fontWeight: "300",
    fontColor: "#FFF",
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
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "space-between",
  },
  chooseColor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  selectedColor: {
    borderColor: "#FCD95B",
    borderWidth: 3,
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
