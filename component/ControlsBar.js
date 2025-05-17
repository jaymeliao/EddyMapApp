import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ControlsBar = ({ undo, clearAnnotations, switchToPreviousImage , switchToNextImage}) => (
  <View style={styles.controlsBar}>
    <TouchableOpacity onPress={undo} style={styles.button}>
      <Icon name="undo" size={30} color="#000" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={clearAnnotations}>
      <Icon name="delete" size={24} color="#ff6666" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={switchToPreviousImage}>
      <Icon name="arrow-back" size={30} color="#000" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={switchToNextImage}>
      <Icon name="arrow-forward" size={30} color="#000" />
    </TouchableOpacity>

  </View>
);

const styles = StyleSheet.create({
  controlsBar: {
    position: "absolute",
    bottom: 50,
    right: 10,
    zIndex: 9,
    flexDirection: "row",
  },
  button: {
    padding: 10,
  },
  clearButton: {
    backgroundColor: "#000",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});

export default ControlsBar;
