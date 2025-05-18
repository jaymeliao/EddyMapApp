import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
  const [showPicker, setShowPicker] = useState(false);
  const colors = ["blue", "red", "green", "orange", "black"];

  return (
    <View style={styles.container}>

      {showPicker && (
        <View style={styles.colorPickerPopover}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                selectedColor === color && styles.colorCircleSelected,
              ]}
              onPress={() => {
                setSelectedColor(color);
                setShowPicker(false);
              }}
            />
          ))}
        </View>
      )}
      <TouchableOpacity
        style={[styles.currentColorButton, { backgroundColor: selectedColor }]}
        onPress={() => setShowPicker(!showPicker)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom:60,
    right: 10,
  },

  currentColorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#333",
  },
  colorPickerPopover: {
    backgroundColor: "#f2f2f2",
    borderRadius: 50,
    elevation: 5,
    flexDirection: "row",
    padding: 5 ,
    marginRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleSelected: {
    borderColor: "#333",
  },
});

export default ColorPicker;
