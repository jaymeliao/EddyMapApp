import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { View, Image, StyleSheet, Dimensions, PanResponder } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const MapCanvas = forwardRef(({ currentImageIndex, isAnnotationMode, selectedColor, images }, ref) => {


  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [imageBounds, setImageBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useImperativeHandle(ref, () => ({
    clearAnnotations: () => {
      setPaths([]);
      setCurrentPath("");
    },
    undoLastPath: () => {
      setPaths(prev => prev.slice(0, -1));
    },
    zoomIn: () => {
      setScale(prev => Math.min(prev * 1.2, 3));
    },
    zoomOut: () => {
      setScale(prev => Math.max(prev * 0.8, 1));
    },
  }));

  const onImageLayout = () => {
    if (imageRef.current) {
      imageRef.current.measureInWindow((x, y, w, h) => {
        setImageBounds({ x, y, width: w, height: h });
      });
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (!isAnnotationMode) return;

      const { locationX, locationY } = evt.nativeEvent;
      const { width: w, height: h } = imageBounds;
      if (locationX >= 0 && locationX <= w && locationY >= 0 && locationY <= h) {
        setCurrentPath(`M${locationX},${locationY}`);
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (!isAnnotationMode) {
        const dx = gestureState.dx / scale;
        const dy = gestureState.dy / scale;
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        const newX = Math.min(Math.max(dx + offset.x, -(scaledWidth - width) / 2), (scaledWidth - width) / 2);
        const newY = Math.min(Math.max(dy + offset.y, -(scaledHeight - height) / 2), (scaledHeight - height) / 2);

        setPan({ x: newX, y: newY });
        return;
      }

      const { locationX, locationY } = evt.nativeEvent;
      const { width: w, height: h } = imageBounds;

      if (locationX >= 0 && locationX <= w && locationY >= 0 && locationY <= h) {
        setCurrentPath(prev => prev ? `${prev} L${locationX},${locationY}` : `M${locationX},${locationY}`);
      } else if (currentPath) {
        setPaths(prev => [...prev, { path: currentPath, color: selectedColor }]);
        setCurrentPath("");
      }
    },
    onPanResponderRelease: () => {
      if (isAnnotationMode && currentPath) {
        setPaths(prev => [...prev, { path: currentPath, color: selectedColor }]);
        setCurrentPath("");
      } else {
        setOffset(pan);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Image
        ref={imageRef}
        source={images[currentImageIndex]}
        style={[
          styles.image,
          {
            transform: [
              { scale },
              { translateX: pan.x },
              { translateY: pan.y },
            ],
          },
        ]}
        resizeMode="contain"
        onLayout={onImageLayout}
      />

      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        {paths.map((item, index) => (
          <Path
            key={index}
            d={item.path}
            stroke={item.color}
            strokeWidth={3}
            fill="none"
          />
        ))}
        {currentPath && (
          <Path d={currentPath} stroke={selectedColor} strokeWidth={3} fill="none" />
        )}
      </Svg>

      <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default MapCanvas;
