// React & React Native Core Components & APIs
import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Slider } from "react-native";

// Expo Modules
import { Audio } from "expo-av";

const AudioPlayer = ({ uri, onPlaybackStatusUpdate }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(false);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const soundRef = useRef(null);

  // Load sound when component mounts
  useEffect(() => {
    const loadSound = async () => {
      try {
        // Load the sound from the provided URI
        const { sound: loadedSound, status } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );
        // Set the sound and duration
        setSound(loadedSound);
        soundRef.current = loadedSound;
        setDuration(status.durationMillis);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    };
    // 
    loadSound();
    return () => {
    // Unload sound when component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [uri]); // Add uri as a dependency

  const playPauseHandler = async () => {
    setIsPlaying(!isPlaying);
  };

  // Handle playback status updates
  const onSlidingComplete = async (value) => {};

  return (
    <View style={styles.container}>
      {/* Display play/pause button */}
      <TouchableOpacity style={styles.button} onPress={playPauseHandler}>
        <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        // Set the value to the current position of the audio
        value={position / duration}
        onValueChange={setPosition}
        onSlidingComplete={onSlidingComplete}
      />
      <Text style={styles.timeText}>
        {/* Format the time display */}
        {Math.floor(position / 60000)}:{Math.floor((position % 60000) / 1000)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    color: "#000",
    fontSize: 12,
  },
});

export default AudioPlayer;
