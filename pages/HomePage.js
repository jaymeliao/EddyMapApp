import {
  StyleSheet,
  View,
  SafeAreaView,
} from "react-native";
import MapCanvas from "../component/MapCanvas";
import { useState, useRef } from "react";
import { useTheme } from "react-native-paper";
import ControlsBar from "../component/ControlsBar";

export default function HomePage() {
  const [isAnnotationMode, setIsAnnotationMode] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mapRef = useRef(null);
  const theme = useTheme();

  const [selectedColor, setSelectedColor] = useState("blue");

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
    if (mapRef.current) {
      mapRef.current.clearAnnotations();
    }
  };

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
    },
    mapCanvas: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.mapCanvas}>
        <MapCanvas
          ref={mapRef}
          currentImageIndex={currentImageIndex}
          isAnnotationMode={isAnnotationMode}
          selectedColor={selectedColor}
        />
        <ControlsBar
          undo={() => mapRef.current?.undoLastPath()}
          clearAnnotations={clearAnnotations}
          switchToPreviousImage={switchToPreviousImage}
          switchToNextImage={switchToNextImage}
        />
      </View>
    </SafeAreaView>
  );
}
