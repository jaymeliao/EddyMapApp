import React, { useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { Audio } from "expo-av";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

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

  const stopRecording = async () => {
    console.log("Stopping recording...");
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and saved at:", uri);

    setRecordingUri(uri);
    setRecording(null);
  };

  const playSound = async () => {
    if (!recordingUri) {
      alert("No recording to play!");
      return;
    }

    console.log("Playing sound...");
    const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
    setSound(sound);
    await sound.playAsync();
  };

  const stopSound = async () => {
    if (sound) {
      console.log("Stopping sound...");
      await sound.stopAsync();
      setSound(null);
    }
  };

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
      {recordingUri && <Text>Recording saved at: {recordingUri}</Text>}
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
});

export default AudioRecorder;
