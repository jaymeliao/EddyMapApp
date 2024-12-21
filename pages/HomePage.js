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
import Icon from "react-native-vector-icons/MaterialIcons"; // Choose your preferred icon library
import AudioRecorder from "../component/AudioRecorder";


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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.controlArea}>
        <View style={styles.float_right}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAnnotations}
          >
            <Icon name="delete" size={24} color="#ff6666" />
          </TouchableOpacity>
        </View>


        <View style={styles.space_between}>
          <TouchableOpacity
            style={styles.button}
            onPress={switchToPreviousImage}
          >
            <Icon name="arrow-back" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={switchToNextImage}>
            <Icon name="arrow-forward" size={30} color="#000" />
          </TouchableOpacity>
        </View>

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
      <View style={{ flex: 1 }}>
        <AudioRecorder />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlArea: {
    zIndex: 3,
  },
  space_between: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  mapArea: {
    flex: 1,
  },

  float_right: {
    justifyContent: "flex-end",
  },
  clearButton: {
    backgroundColor: "#000",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
