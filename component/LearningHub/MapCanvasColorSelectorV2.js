/*v3.2: Color Selection
Choose from a set of predefined colors for drawing.
*/
import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  PanResponder,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";

const { height, width } = Dimensions.get("window");

const MapCanvas = forwardRef(({ currentImageIndex, isAnnotationMode }, ref) => {
  const images = [
    require("../../assets/floorplan1.png"),
    require("../../assets/T1.png"),
    require("../../assets/T2.png"),
    require("../../assets/T3.png"),
    require("../../assets/T4.png"),
    require("../../assets/T5.png"),
    require("../../assets/T6.png"),
    require("../../assets/T7.png"),
    require("../../assets/T8.png"),
  ];

  const [selectedColor, setSelectedColor] = useState("blue");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [scale, setScale] = useState(1);
  const [annotations, setAnnotations] = useState([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState(null);

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
        const newY = gestureState.moveY - height * 0.2;
        const newPoint = formatCoordinate(newX, newY);

        if (currentPath === "") {
          setCurrentPath(`M${newPoint}`);
        } else {
          setCurrentPath((prevPath) => `${prevPath} L${newPoint}`);
        }
      } else {
        const scaledDx = gestureState.dx / scale;
        const scaledDy = gestureState.dy / scale;

        if (Math.abs(scaledDx) < 2 && Math.abs(scaledDy) < 2) return;

        const { scaledWidth, scaledHeight } = getImageDimensions();

        const targetX = scaledDx + offset.x;
        const targetY = scaledDy + offset.y;

        const maxX = Math.max(0, (scaledWidth - width) / 2);
        const maxY = Math.max(0, (scaledHeight - height) / 2);

        setPan({
          x: Math.min(Math.max(lerp(pan.x, targetX, 0.7), -maxX), maxX),
          y: Math.min(Math.max(lerp(pan.y, targetY, 0.7), -maxY), maxY),
        });

        setOffset({ x: pan.x, y: pan.y });
      }
    },
    onPanResponderRelease: () => {
      if (isAnnotationMode && currentPath !== "") {
        setPaths([...paths, { path: currentPath, color: selectedColor }]);
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
      setTextPosition(formatCoordinate(newX, newY));
      setText("");
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev * 0.8, 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapArea}>
        <Image
          source={images[currentImageIndex]}
          style={[
            {
              transform: [
                { scale },
                { translateX: pan.x },
                { translateY: pan.y },
              ],
              width: width,
              height: height,
            },
          ]}
          resizeMode="contain"
        />

        <Svg style={StyleSheet.absoluteFill}>
          {paths.map((item, index) => (
            <Path
              key={index}
              d={item.path}
              stroke={item.color}
              strokeWidth={3}
              fill="none"
            />
          ))}
          {currentPath !== "" && (
            <Path d={currentPath} stroke={selectedColor} strokeWidth={3} fill="none" />
          )}
          {annotations.map((annotation, index) => (
            <SvgText
              key={index}
              x={annotation.position[0]}
              y={annotation.position[1]}
              fill="black"
              fontSize="16"
            >
              {annotation.text}
            </SvgText>
          ))}
        </Svg>

        <View
          {...panResponder.panHandlers}
          style={styles.drawingOverlay}
          onTouchEnd={handleOverlayPress}
        />
      </View>

      {/* Color Selector Button */}
      <View style={styles.colorSelectorContainer}>
        <TouchableOpacity
          style={[styles.currentColorButton, { backgroundColor: selectedColor }]}
          onPress={() => setShowColorPicker((prev) => !prev)}
        />
        {showColorPicker && (
          <View style={styles.colorPickerPopover}>
            {["blue", "red", "green", "orange", "black"].map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorCircleSelected,
                ]}
                onPress={() => {
                  setSelectedColor(color);
                  setShowColorPicker(false);
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* Zoom Controls */}
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  zoomControls: {
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 50,
    left: 10,
    right: 10,
  },
  button: {
    padding: 10,
  },
  // New styles for color picker button and panel
  colorSelectorContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "flex-end",
    zIndex: 3,
  },
  currentColorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#333",
  },
  colorPickerPopover: {
    marginTop: 8,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 10,
    elevation: 5,
    flexDirection: "row",
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleSelected: {
    borderColor: "#333",
  },
});

export default MapCanvas;
