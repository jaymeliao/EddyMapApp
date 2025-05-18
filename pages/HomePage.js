import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import MapCanvas from '../component/MapCanvas';
import { useTheme } from "react-native-paper";
import ControlsBar from "../component/ControlsBar";
import ColorPicker from "../component/ColorPicker";
import AudioRecorder from "../component/AudioRecorder";


const HomePage = () => {

  const images = [
    require("../assets/floorplan1.png"),
    require("../assets/T1.png"),
    require("../assets/T2.png"),
    require("../assets/T3.png"),
    require("../assets/T4.png"),
    require("../assets/T5.png"),
    require("../assets/T6.png"),
    require("../assets/T7.png"),
    require("../assets/T8.png"),
  ];

  const canvasRef = useRef();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnnotationMode, setIsAnnotationMode] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#0000FF');
  const theme = useTheme();
  const imageCount = images.length;

  const switchToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageCount);
  };
  const switchToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + 9) % imageCount);
  };
  const toggleAnnotationMode = () => {
    setIsAnnotationMode((prev) => !prev);
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "white" }]} >
      <ControlsBar
        undo={() => canvasRef.current?.undoLastPath()}
        clearAnnotations={() => canvasRef.current?.clearAnnotations()}
        switchToPreviousImage={switchToPreviousImage}
        switchToNextImage={switchToNextImage}
        zoomIn={() => canvasRef.current?.zoomIn()}
        zoomOut={() => canvasRef.current?.zoomOut()}
        toggleAnnotationMode={toggleAnnotationMode}
        isAnnotationMode={isAnnotationMode}

      />
      <AudioRecorder />
      <MapCanvas
        ref={canvasRef}
        currentImageIndex={currentImageIndex}
        isAnnotationMode={isAnnotationMode}
        selectedColor={selectedColor}
        images={images}
      />
      <ColorPicker
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomePage;
