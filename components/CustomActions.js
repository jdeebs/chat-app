// React & React Native Core Components & APIs
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";

// Firebase Firestore Modules
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// All Expo Module functions To Reference As Collective Objects
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

// Expo Action Sheet Module
import { useActionSheet } from "@expo/react-native-action-sheet";

// UUID Library
import { v4 as uuidv4 } from "uuid";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  storage,
  onSend,
  userID,
  name,
}) => {
  const actionSheet = useActionSheet();

  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
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

  const pickImage = async () => {
    // Request permission to access media library
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        // Get the image URI, generate unique reference string, and fetch the image
        const imageURI = result.assets[0].uri;
        const uniqueRefString = generateReference(imageURI);
        const response = await fetch(imageURI);
        // Get the image as a blob to upload to Firebase storage
        const blob = await response.blob();
        // Reference to the Firebase storage bucket
        const newUploadRef = ref(storage, uniqueRefString);
        // Method to upload the blob to the Firebase storage bucket
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
          console.log("File has been uploaded successfully.");
          // Get the download URL of the image
          const imageURL = await getDownloadURL(snapshot.ref);

          // Format the message with the correct data (no undefined values)
          const imageMessage = {
            _id: uuidv4(),
            text: "",
            createdAt: new Date(),
            user: { _id: userID, name: name },
            image: imageURL,
          };
          onSend([imageMessage]);
        });
      } else Alert.alert("Permission access denied.");
    }
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
          // Format the message with the correct data (no undefined values)
          const locationMessage = {
            _id: uuidv4(),
            text: "",
            createdAt: new Date(),
            user: { _id: userID, name: name },
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          };
          onSend([locationMessage]);
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
