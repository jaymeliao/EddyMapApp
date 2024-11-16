import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MapSwitchableZoomableControlPanel from "../component/MapSwitchableZoomableControlPanel";
import React, { useState, createRef } from "react";
import { useTheme } from "react-native-paper";

export default function HomePage() {
  const [isAnnotationMode, setIsAnnotationMode] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const controlPanelRef = createRef();

  // Move useTheme inside the component
  const theme = useTheme();

  const toggleAnnotationMode = () => {
    setIsAnnotationMode((prevMode) => !prevMode);
  };

  const switchToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 9);
  };

  const switchToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + 9) % 9);
  };

  const clearAnnotations = () => {
    if (controlPanelRef.current) {
      controlPanelRef.current.clearAnnotations();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.controlArea}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAnnotations}>
          <Text style={styles.clearButtonText}>Clear Annotations</Text>
        </TouchableOpacity>
        <Button title="Previous Image" onPress={switchToPreviousImage} />
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
  },
  controlArea: {
   
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  mapArea: {
    flex: 1, // 80% of the screen height
    backgroundColor: "green",
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
});
