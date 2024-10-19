import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  PanResponder,
  Image,
  StyleSheet,
  TextInput,
  Text,
  Button,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";

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

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (isAnnotationMode) {
          const newX = gestureState.moveX;
          const newY = gestureState.moveY - height * 0.2;
          const newPoint = formatCoordinate(newX, newY);

          if (currentPath === "") {
            setCurrentPath(`M${newPoint}`);
          } else {
            setCurrentPath((prevPath) => `${prevPath} L${newPoint}`);
          }
        } else {
          // Handle panning the image in move mode
          setPan({
            x: gestureState.dx + offset.x,
            y: gestureState.dy + offset.y,
          });
        }
      },
      onPanResponderRelease: () => {
        if (isAnnotationMode && currentPath !== "") {
          setPaths([...paths, currentPath]);
          setCurrentPath("");
        } else {
          // Update the offset for panning
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
      setScale((prevScale) => Math.min(prevScale * 1.2, 5)); // Cap at a max scale of 5x
    };

    const zoomOut = () => {
      setScale((prevScale) => Math.max(prevScale * 0.8, 1)); // Minimum scale of 1x
    };

    return (
      <View style={styles.container}>
        {/* Ensure the zoom controls are above the rest of the content */}
        <View style={styles.zoomControls}>
          <Button title="Zoom In" onPress={zoomIn} />
          <Button title="Zoom Out" onPress={zoomOut} />
        </View>

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

          {textPosition && (
            <TextInput
              style={[
                styles.textInput,
                {
                  left: textPosition.split(",")[0] - 50,
                  top: textPosition.split(",")[1] - 20,
                },
              ]} // Position the text input
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleTextInputSubmit}
              placeholder="Enter text"
              autoFocus
            />
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  zoomControls: {
    // Place zoom buttons in an absolute position at the top of the screen
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 2, // Ensure buttons are on top
    flexDirection: "row",
    justifyContent: "space-between",
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
  textInput: {
    position: "absolute",
    borderBottomWidth: 1,
    borderBottomColor: "blue",
    width: 100,
    padding: 5,
    zIndex: 2,
  },
  annotationText: {
    position: "absolute",
    color: "black",
    zIndex: 2,
  },
});

export default MapSwitchableZoomableControlPanel;
