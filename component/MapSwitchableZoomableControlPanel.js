import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  PanResponder,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";

const { height, width } = Dimensions.get("window");

const MapSwitchableZoomableControlPanel = forwardRef(
  ({ currentImageIndex, isAnnotationMode }, ref) => {
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

    const [currentPath, setCurrentPath] = useState("");
    const [paths, setPaths] = useState([]);
    const [scale, setScale] = useState(1); // Track scale for zoom
    const [text, setText] = useState(""); // Text input state
    const [textPosition, setTextPosition] = useState(null); // Position for text input
    const [annotations, setAnnotations] = useState([]); // Array to store text annotations
    const [pan, setPan] = useState({ x: 0, y: 0 }); // Track pan movement
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Keep track of panning offset

    useImperativeHandle(ref, () => ({
      clearAnnotations: () => {
        setPaths([]);
        setCurrentPath("");
        setTextPosition(null);
        setText("");
        setAnnotations([]);
      },
    }));

    const formatCoordinate = (x, y) => `${x},${y}`;

    const getImageDimensions = () => {
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      return { scaledWidth, scaledHeight };
    };

    const lerp = (start, end, t) => start * (1 - t) + end * t;

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (isAnnotationMode) {
          const newX = gestureState.moveX;
          const newY = gestureState.moveY - height * 0.20; //adjust this for finger tip and pen
          const newPoint = formatCoordinate(newX, newY);

          if (currentPath === "") {
            setCurrentPath(`M${newPoint}`);
          } else {
            setCurrentPath((prevPath) => `${prevPath} L${newPoint}`);
          }
        } else {
          const scaledDx = gestureState.dx / scale;
          const scaledDy = gestureState.dy / scale;

          // Add a small threshold to prevent tiny shakes
          if (Math.abs(scaledDx) < 2 && Math.abs(scaledDy) < 2) return;

          const { scaledWidth, scaledHeight } = getImageDimensions();

          // Calculate smoothed new position
          const targetX = scaledDx + offset.x;
          const targetY = scaledDy + offset.y;

          const maxX = Math.max(0, (scaledWidth - width) / 2);
          const maxY = Math.max(0, (scaledHeight - height) / 2);

          setPan({
            x: Math.min(Math.max(lerp(pan.x, targetX, 0.7), -maxX), maxX), // Increase to 0.3 Smoothing, more is better
            y: Math.min(Math.max(lerp(pan.y, targetY, 0.7), -maxY), maxY), // Increase to 0.3 Smoothing
          });

          setOffset({ x: pan.x, y: pan.y });
        }
      },
      onPanResponderRelease: () => {
        if (isAnnotationMode && currentPath !== "") {
          setPaths([...paths, currentPath]);
          setCurrentPath("");
        } else {
          setOffset({ x: pan.x, y: pan.y });
        }
      },
    });

    const handleOverlayPress = (evt) => {
      if (isAnnotationMode) {
        const newX = evt.nativeEvent.locationX;
        const newY = evt.nativeEvent.locationY;
        setTextPosition(formatCoordinate(newX, newY)); // Update text position
        setText(""); // Reset text input
      }
    };

    const handleTextInputSubmit = () => {
      if (text && textPosition) {
        const position = textPosition.split(",").map(Number); // Convert string position to number
        setAnnotations([...annotations, { text, position }]); // Store annotation
        setText(""); // Clear the input field
        setTextPosition(null); // Clear the position
      }
    };

    const zoomIn = () => {
      setScale((prevScale) => Math.min(prevScale * 1.2, 3)); // Cap at a max scale of 5x
    };

    const zoomOut = () => {
      setScale((prevScale) => Math.max(prevScale * 0.8, 1)); // Minimum scale of 1x
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mapArea}>
          <Image
            source={images[currentImageIndex]}
            style={[
              {
                transform: [
                  { scale }, // Apply scale transform for zooming
                  { translateX: pan.x },
                  { translateY: pan.y },
                ],
                width: width, // Set width and height as base size
                height: height,
              },
            ]}
            resizeMode="contain"
          />

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
            {annotations.map((annotation, index) => (
              <Text
                key={index}
                style={[
                  styles.annotationText,
                  { left: annotation.position[0], top: annotation.position[1] },
                ]}
              >
                {annotation.text}
              </Text>
            ))}
          </Svg>

          <View
            {...panResponder.panHandlers}
            style={styles.drawingOverlay}
            onTouchEnd={handleOverlayPress} // Add touch event for overlay
          />
        </View>

        <View style={styles.zoomControls}>
          <TouchableOpacity onPress={zoomIn} style={styles.button}>
            <Icon name="zoom-in" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={zoomOut} style={styles.button}>
            <Icon name="zoom-out" size={30} color="#000" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  zoomControls: {
    // Place zoom buttons in an absolute position at the bottom of the screen
    position: "absolute",
    zIndex: 2, // Ensure buttons are on top
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 50,
    left: 10,
    right: 10,
  },
  mapArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  drawingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  annotationText: {
    position: "absolute",
    color: "black",
    zIndex: 2,
  },
});

export default MapSwitchableZoomableControlPanel;
