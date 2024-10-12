import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import MapSwitchableZoomableControlPanel from "./component/MapSwitchableZoomableControlPanel";
import React, { useState } from "react"; // Import React and useState

export default function App() {
  const [isAnnotationMode, setIsAnnotationMode] = useState(true); // Add state for annotation mode
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index

  const toggleAnnotationMode = () => {
    setIsAnnotationMode((prevMode) => !prevMode);
  };

  const switchToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 9); // Loop through images assuming 9 total images
  };

  const switchToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + 9) % 9); // Loop through images assuming 9 total images
  };

  const clearAnnotations = () => {
    // Pass the clear function to the control panel
    if (controlPanelRef.current) {
      controlPanelRef.current.clearAnnotations();
    }
  };

  const controlPanelRef = React.createRef(); // Create a reference to the control panel

  return (
    <View style={styles.container}>
      <View style={styles.searchArea}>
        <Text>To be Continued: Search Map by floor number etc</Text>

        {/* Control Panel */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={clearAnnotations}>
            <Text style={styles.clearButtonText}>Clear Annotations</Text>
          </TouchableOpacity>

          {/* <Button title="Previous Image" onPress={switchToPreviousImage} />
          <Button title="Next Image" onPress={switchToNextImage} /> */}

          {/* Annotation Mode Toggle */}
          <View style={styles.annotationMode}>
            <Button
              title={isAnnotationMode ? "Switch to Move" : "Switch to Annotate"}
              onPress={toggleAnnotationMode}
            />
          </View>
        </View>
      </View>
      <View style={styles.mapArea}>
        <MapSwitchableZoomableControlPanel
          ref={controlPanelRef}
          currentImageIndex={currentImageIndex}
          isAnnotationMode={isAnnotationMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f38020",
  },
  searchArea: {
    flex: 2, // 20% of the screen height
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  mapArea: {
    flex: 8, // 80% of the screen height
    backgroundColor: "#fff",
  },
  controlsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10, // Optional margin for spacing
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
