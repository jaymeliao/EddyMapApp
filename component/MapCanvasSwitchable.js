import React, { useState } from "react";
import {
  View,
  PanResponder,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Dimensions, // Import Dimensions to get the screen size
} from "react-native";
import Svg, { Path } from "react-native-svg";

// Get the screen height and width
const { height, width } = Dimensions.get("window");

const MapCanvasSwitchable = () => {
  // Array of image paths
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

  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState(""); // Current freehand drawing path
  const [paths, setPaths] = useState([]); // Array to store all drawings

  // Format coordinates utility
  const formatCoordinate = (x, y) => `${x},${y}`;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newX = gestureState.moveX;
      const newY = gestureState.moveY - height * 0.2; // Adjust for the 20% height taken by the search area
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

  // Function to clear all annotations
  const clearAnnotations = () => {
    setPaths([]);
    setCurrentPath("");
  };

  // Function to switch to the next image
  const switchToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to switch to the previous image
  const switchToPreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <View style={styles.container}>
      {/* Floor Plan Image */}
      <View style={styles.mapArea}>
        <Image
          source={images[currentImageIndex]} // Dynamically use the current image
          style={styles.floorPlan}
          resizeMode="contain"
        />

        {/* SVG for drawing */}
        <Svg style={StyleSheet.absoluteFill}>
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              stroke="blue"
              strokeWidth="3"
              fill="none"
            />
          ))}
          {currentPath && (
            <Path d={currentPath} stroke="red" strokeWidth="3" fill="none" />
          )}
        </Svg>

        <View {...panResponder.panHandlers} style={styles.drawingOverlay} />
      </View>

      {/* Controls for switching images and clearing annotations */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAnnotations}>
          <Text style={styles.clearButtonText}>Clear Annotations</Text>
        </TouchableOpacity>

        {/* Button to switch to the previous image */}
        <Button title="Previous Image" onPress={switchToPreviousImage} />

        {/* Button to switch to the next image */}
        <Button title="Next Image" onPress={switchToNextImage} />
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
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default MapCanvasSwitchable;
