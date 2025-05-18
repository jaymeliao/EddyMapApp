import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ZoomScales = ({ zoomIn, zoomOut }) => (
  <View style={styles.zoomControls}>
    <TouchableOpacity onPress={zoomIn} style={styles.button}>
      <Icon name="zoom-in" size={30} color="#000" />
    </TouchableOpacity>
    <TouchableOpacity onPress={zoomOut} style={styles.button}>
      <Icon name="zoom-out" size={30} color="#000" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  zoomControls: {
    disaplay: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  button: {
    padding: 10,
  },
});

export default ZoomScales;
