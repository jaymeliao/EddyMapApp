import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ControlsBar = ({ undo }) => (
  <View style={styles.controlsBar}>
    <TouchableOpacity onPress={undo} style={styles.button}>
      <Icon name="undo" size={30} color="#000" />
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
});

export default ControlsBar;
