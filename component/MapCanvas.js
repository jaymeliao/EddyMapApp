import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, Image, StyleSheet, Dimensions, PanResponder } from "react-native";
import Svg, { Path } from "react-native-svg";

const { height, width } = Dimensions.get("window");

const MapCanvas = forwardRef(({ currentImageIndex, isAnnotationMode, selectedColor }, ref) => {
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

  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    clearAnnotations: () => {
      setPaths([]);
      setCurrentPath("");
    },
    undoLastPath: () => {
      setPaths((prev) => prev.slice(0, -1));
    },
    zoomIn: () => setScale((prev) => Math.min(prev * 1.2, 3)),
    zoomOut: () => setScale((prev) => Math.max(prev * 0.8, 1)),
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
        const newY = gestureState.moveY - height * 0.1;
        const newPoint = formatCoordinate(newX, newY);
        if (currentPath === "") {
          setCurrentPath(`M${newPoint}`);
        } else {
          setCurrentPath((prev) => `${prev} L${newPoint}`);
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

        setPan((prevPan) => {
          const newPan = {
            x: Math.min(Math.max(lerp(prevPan.x, targetX, 0.7), -maxX), maxX),
            y: Math.min(Math.max(lerp(prevPan.y, targetY, 0.7), -maxY), maxY),
          };
          setOffset(newPan);
          return newPan;
        });
      }
    },
    onPanResponderRelease: () => {
      if (isAnnotationMode && currentPath !== "") {
        setPaths((prev) => [...prev, { path: currentPath, color: selectedColor }]);
        setCurrentPath("");
      } else {
        setOffset({ x: pan.x, y: pan.y });
      }
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={images[currentImageIndex]}
        style={[
          {
            transform: [{ scale }, { translateX: pan.x }, { translateY: pan.y }],
            width,
            height,
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
      </Svg>

      <View {...panResponder.panHandlers} style={styles.drawingOverlay} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default MapCanvas;
