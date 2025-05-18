import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);

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
      <View style={styles.hStack}>
        {recording ?
          (<TouchableOpacity onPress={stopRecording} style={{ padding: 10 }}>
            <Icon name="stop" size={30} color="#ff6666" />
          </TouchableOpacity>) :
          (<TouchableOpacity onPress={startRecording} style={{ padding: 10 }}>
            <Icon name="mic" size={30} color="#000" />
          </TouchableOpacity>)}


        <TouchableOpacity
          onPress={playSound}
          style={{ padding: 10, opacity: recordingUri ? 1 : 0.3 }}
        >
          <Icon
            name="play-arrow"
            size={30}
            color={recordingUri ? "#000" : "#888"}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={clearRecording}
        disabled={!recordingUri}
        style={{
          backgroundColor: recordingUri ? '#ffcccc' : '#dddddd',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <Text style={{ color: recordingUri ? 'red' : '#888', fontWeight: 'bold' }}>
          Clear Recording
        </Text>
      </TouchableOpacity>

      {recordingUri && <Text>voice saved</Text>}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  hStack: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

});

export default AudioRecorder;
