import React, { useState } from 'react';
import { View, PanResponder, Dimensions, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const FreehandDrawingApp = () => {
  const [currentPath, setCurrentPath] = useState(''); // Current freehand drawing path
  const [paths, setPaths] = useState([]); // Array to store all drawings

  const formatCoordinate = (x, y) => `${x},${y}`; // Utility to format coordinates

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newPoint = formatCoordinate(gestureState.moveX, gestureState.moveY);

      if (currentPath === '') {
        // Ensure the path starts with a valid 'M' (move to)
        setCurrentPath(`M${newPoint}`);
      } else {
        // Continue adding points with 'L' (line to)
        setCurrentPath((prevPath) => `${prevPath} L${newPoint}`);
      }
    },
    onPanResponderRelease: () => {
      if (currentPath !== '') {
        // Add the completed path to the list of paths
        setPaths([...paths, currentPath]);
        setCurrentPath(''); // Reset the current path for the next drawing
      }
    },
  });

  // Function to clear all annotations
  const clearAnnotations = () => {
    setPaths([]); // Clear all drawn paths
    setCurrentPath(''); // Clear the current path (if any in progress)
  };

  return (
    <View style={styles.container}>
      {/* Floor Plan Image */}
      <View style={styles.floorPlanContainer}>
        <Image
          source={require('../assets/floorplan.jpg')} // Replace with your floor plan image
          style={styles.floorPlan}
          resizeMode="contain"
        />

        {/* SVG for drawing */}
        <Svg style={StyleSheet.absoluteFill}>
          {/* Render all completed paths */}
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              stroke="blue"
              strokeWidth="3"
              fill="none"
            />
          ))}

          {/* Render the current freehand drawing path */}
          {currentPath && (
            <Path
              d={currentPath}
              stroke="red"
              strokeWidth="3"
              fill="none"
            />
          )}
        </Svg>
      </View>

      {/* Drawing surface for touch gestures */}
      <View {...panResponder.panHandlers} style={styles.drawingOverlay} />

      {/* Clear Button */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAnnotations}>
          <Text style={styles.clearButtonText}>Clear Annotations</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  floorPlanContainer: {
    width: width,
    height: height,
  },
  floorPlan: {
    width: width,
    height: height,
    position: 'absolute',
  },
  drawingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ff6666',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FreehandDrawingApp;
