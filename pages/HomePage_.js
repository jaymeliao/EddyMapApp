import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MapCanvas from "../component/MapCanvas";
import { useState, useRef } from "react";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import AudioRecorder from "../component/AudioRecorder";
import ZoomScales from "../component/ZoomScales";
import ColorPicker from "../component/ColorPicker";
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} >
      <View style={styles.controlArea}>

        <View style={styles.annotationMode}>
          <Button
            title={isAnnotationMode ? "Switch to Move" : "Switch to Annotate"}
            onPress={toggleAnnotationMode}
          />
        </View>
        <ControlsBar undo={() => mapRef.current?.undoLastPath()} clearAnnotations={clearAnnotations}
          switchToPreviousImage={switchToPreviousImage}
          switchToNextImage={switchToNextImage} />
      </View>

      <View style={styles.mapArea}>
        <MapCanvas
          ref={mapRef}
          currentImageIndex={currentImageIndex}
          isAnnotationMode={isAnnotationMode}
          selectedColor={selectedColor}
        />

        {/* Zoom, ColorPicker and Undo buttons positioned on top */}
        <ZoomScales
          zoomIn={() => mapRef.current?.zoomIn()}
          zoomOut={() => mapRef.current?.zoomOut()}
        />
        <ColorPicker
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
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

});
