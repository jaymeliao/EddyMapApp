import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
  const [showPicker, setShowPicker] = useState(false);
  const colors = ["blue", "red", "green", "orange", "black"];

  return (
    <View style={styles.colorSelectorContainer}>
      <TouchableOpacity
        style={[styles.currentColorButton, { backgroundColor: selectedColor }]}
        onPress={() => setShowPicker(!showPicker)}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  colorSelectorContainer: {
    position: "absolute",
    top: 70,
    right: 10,
    alignItems: "flex-end",
    zIndex: 9,
  },
  currentColorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#333",
  },
  colorPickerPopover: {
    marginTop: 8,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 10,
    elevation: 5,
    flexDirection: "row",
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
