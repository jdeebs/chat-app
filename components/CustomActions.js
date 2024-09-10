// React & React Native Core Components & APIs
import { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";

// Import All Expo Module functions To Reference As Collective Objects
import * as Location from "expo-location";

// Expo Action Sheet Module
import { useActionSheet } from "@expo/react-native-action-sheet";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend }) => {
  const actionSheet = useActionSheet();

  if (!onSend) {
    console.error("onSend function is undefined in CustomActions");
  };

  const onActionPress = () => {
    // Dismiss the keyboard before opening the action sheet
    Keyboard.dismiss();

    // Create options for the user to choose from
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
        }
      }
    );
  };

  const getLocation = async () => {
    try {
      // Request permission to access the location
      let permissions = await Location.requestForegroundPermissionsAsync();

      // Check if permission is granted
      if (permissions?.granted) {
        // Get the current location
        const location = await Location.getCurrentPositionAsync({});

        // Check if location data is available
        if (location) {
          onSend({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          Alert.alert("Location data is not available.");
        }
      } else {
        Alert.alert("Location access denied. Please enable location access.");
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error("Error in getLocation function:", error);
      Alert.alert("An error occurred while fetching location.");
    }
  };

  return (
      <TouchableOpacity style={styles.container} onPress={onActionPress}>
        <View style={[styles.wrapper, wrapperStyle]}>
          <Text style={[styles.iconText, iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
