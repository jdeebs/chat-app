// React & React Native Core Components & APIs
import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

// Expo Modules
import { Audio } from "expo-av";

const AudioPlayer = ({ uri }) => {
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
          { shouldPlay: false }
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
    loadSound();

    return () => {
      // Unload sound when component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [uri]); // Add uri as a dependency

  // Update playback status periodically
  useEffect(() => {
    if (sound) {
      const updatePlaybackStatus = async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
          setIsBuffering(status.isBuffering);
          // When audio finishes
          if (status.didJustFinish) {
            // Change pause button to play
            setIsPlaying(false);
            // Reset slider position
            setPosition(0);
          }
        } else {
          setIsPlaying(false);
          setIsBuffering(false);
        }
      };

      // Poll the playback status every 50ms
      const interval = setInterval(updatePlaybackStatus, 50);

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [sound]);

  const playPauseHandler = async () => {
    // Play or pause the sound based on the current state
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        if (position === duration) {
          // Reset position when playing starts
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onSlidingComplete = async (value) => {
    // Go to the selected position in the audio
    if (sound) {
      const newPosition = value * duration;
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);

      if (!isPlaying) {
        // Start playback if not already playing
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Display play/pause button */}
      <TouchableOpacity style={styles.button} onPress={playPauseHandler}>
        <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
      {/* Slider to control audio position */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        // Set the value to the current position of the audio
        value={duration ? position / duration : 0}
        onValueChange={setPosition}
        onSlidingComplete={onSlidingComplete}
      />
      <Text style={styles.timeText}>
        {/* Format the time display */}
        {position ? Math.floor(position / 60000) + ":" + Math.floor((position % 60000) / 1000).toString().padStart(2, '0') : "0:00"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 60,
    padding: 10,
    backgroundColor: "#B1B2FF",
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  slider: {
    width: 150,
  },
  timeText: {
    color: "#FFF",
    fontSize: 12,
  },
});

export default AudioPlayer;
