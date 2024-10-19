import { StyleSheet, View, Text, Button, TouchableOpacity, SafeAreaView } from "react-native";
import MapSwitchableZoomableControlPanel from "./component/MapSwitchableZoomableControlPanel";
import React, { useState, createRef } from "react";

export default function App() {
  const [isAnnotationMode, setIsAnnotationMode] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const controlPanelRef = createRef();

  const toggleAnnotationMode = () => {
    setIsAnnotationMode((prevMode) => !prevMode);
  };

  const switchToNextImage = () => {
    console.log("Next Image Button Pressed"); // Debugging log
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 9);
  };

  const switchToPreviousImage = () => {
    console.log("Previous Image Button Pressed"); // Debugging log
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + 9) % 9);
  };

  const clearAnnotations = () => {
    if (controlPanelRef.current) {
      controlPanelRef.current.clearAnnotations();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contralArea}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAnnotations}>
          <Text style={styles.clearButtonText}>Clear Annotations</Text>
        </TouchableOpacity>
        <Button title="Previous Image" onPress={switchToPreviousImage} />

        {/* Next Image Button */}
        <Button title="Next Image" onPress={switchToNextImage} />

        {/* Annotation Mode Toggle */}
        <View style={styles.annotationMode}>
          <Button
            title={isAnnotationMode ? "Switch to Move" : "Switch to Annotate"}
            onPress={toggleAnnotationMode}
          />
        </View>
      </View>
      <View style={styles.mapArea}>
        <MapSwitchableZoomableControlPanel
          ref={controlPanelRef}
          currentImageIndex={currentImageIndex}
          isAnnotationMode={isAnnotationMode}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f38020",
  },
  contralArea: {
    flex: 2, // 20% of the screen height
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex:3
  },
  mapArea: {
    flex: 8, // 80% of the screen height
    backgroundColor: "#fff",
  },

  clearButton: {
    backgroundColor: "#ff6666",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  annotationMode: {
    marginTop: 10,
  },
});
