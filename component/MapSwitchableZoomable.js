import React, { useState } from "react";
import {
  View,
  PanResponder,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Dimensions,
  TextInput,  // Import TextInput for the text box
} from "react-native";
import Svg, { Path } from "react-native-svg";

// Get the screen height and width
const { height, width } = Dimensions.get("window");

const MapSwitchableZoomable = () => {
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState("");
  const [paths, setPaths] = useState([]);
  const [scale, setScale] = useState(1); // Track scale for zoom
  const [text, setText] = useState(""); // Text input state
  const [textPosition, setTextPosition] = useState(null); // Position for text input
  const [annotations, setAnnotations] = useState([]); // Array to store text annotations

  const formatCoordinate = (x, y) => `${x},${y}`;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newX = gestureState.moveX;
      const newY = gestureState.moveY - height * 0.2;
      const newPoint = formatCoordinate(newX, newY);

      if (currentPath === "") {
        setCurrentPath(`M${newPoint}`);
      } else {
        setCurrentPath((prevPath) => `${prevPath} L${newPoint}`);
      }
    },
    onPanResponderRelease: () => {
      if (currentPath !== "") {
        setPaths([...paths, currentPath]);
        setCurrentPath("");
      }
    },
  });

  const clearAnnotations = () => {
    setPaths([]);
    setCurrentPath("");
    setTextPosition(null);
    setText("");
    setAnnotations([]);
  };

  const switchToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const switchToPreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const zoomIn = () => setScale((prevScale) => prevScale * 1.2);
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale * 0.8, 1)); // Limit the zoom-out

  const handleOverlayPress = (evt) => {
    const newX = evt.nativeEvent.locationX;
    const newY = evt.nativeEvent.locationY;
    setTextPosition(formatCoordinate(newX, newY)); // Update text position
    setText(""); // Reset text input
  };

  const handleTextInputSubmit = () => {
    if (text && textPosition) {
      const position = textPosition.split(",").map(Number); // Convert string position to number
      setAnnotations([...annotations, { text, position }]); // Store annotation
      setText(""); // Clear the input field
      setTextPosition(null); // Clear the position
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <Image
          source={images[currentImageIndex]}
          style={[styles.floorPlan, { transform: [{ scale }] }]} // Apply scaling to the image
          resizeMode="contain"
        />

        <Svg style={StyleSheet.absoluteFill}>
          {paths.map((path, index) => (
            <Path key={index} d={path} stroke="blue" strokeWidth="3" fill="none" />
          ))}
          {currentPath && <Path d={currentPath} stroke="red" strokeWidth="3" fill="none" />}
          {annotations.map((annotation, index) => (
            <Text key={index} style={[styles.annotationText, { left: annotation.position[0], top: annotation.position[1] }]}>
              {annotation.text}
            </Text>
          ))}
        </Svg>

        <View 
          {...panResponder.panHandlers} 
          style={styles.drawingOverlay} 
          onTouchEnd={handleOverlayPress} // Add touch event for overlay
        />
        
        {textPosition && (
          <TextInput
            style={[styles.textInput, { left: textPosition.split(",")[0] - 50, top: textPosition.split(",")[1] - 20 }]} // Position the text input
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleTextInputSubmit}
            placeholder="Enter text"
            autoFocus
          />
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAnnotations}>
          <Text style={styles.clearButtonText}>Clear Annotations</Text>
        </TouchableOpacity>

        <Button title="Previous Image" onPress={switchToPreviousImage} />
        <Button title="Next Image" onPress={switchToNextImage} />

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <Button title="Zoom In" onPress={zoomIn} />
          <Button title="Zoom Out" onPress={zoomOut} />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapArea: {
    flex: 8,
    width: "100%",
    backgroundColor: "#fff",
  },
  floorPlan: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  drawingOverlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  controlsContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
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
  zoomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginVertical: 10,
  },
  textInput: {
    position: "absolute",
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
    width: 100,
  },
  annotationText: {
    position: "absolute",
    color: "black",
    backgroundColor: "white",
    padding: 2,
    borderRadius: 3,
  },
});

export default MapSwitchableZoomable;
