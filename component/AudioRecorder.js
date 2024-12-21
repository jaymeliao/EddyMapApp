import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Text, Alert } from "react-native";
import { Audio } from "expo-av";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);

  // Cleanup sound resource when the component unmounts or sound is replaced
  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading sound...");
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Start recording audio
  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access microphone is required!");
        return;
      }
  
      console.log("Setting audio mode...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: 1,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
  
      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started!");
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };
  

  // Stop recording audio
  const stopRecording = async () => {
    try {
      console.log("Stopping recording...");
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and saved at:", uri);

      setRecordingUri(uri);
      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  // Play recorded audio
  const playSound = async () => {
    if (!recordingUri) {
      Alert.alert("No Recording Found", "Please record something to play!");
      return;
    }

    try {
      console.log("Playing sound...");
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Stop playback
  const stopSound = async () => {
    if (sound) {
      try {
        console.log("Stopping sound...");
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
  };

  // Clear the recording
  const clearRecording = () => {
    if (sound) stopSound();
    setRecordingUri(null);
    console.log("Recording cleared!");
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button title="Play Recording" onPress={playSound} disabled={!recordingUri} />
      <Button title="Clear Recording" onPress={clearRecording} disabled={!recordingUri} />
      {recordingUri && <Text style={styles.text}>Recording saved at: {recordingUri}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
});

export default AudioRecorder;
