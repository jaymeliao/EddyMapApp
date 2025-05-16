import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { View, PanResponder } from "react-native";
import { Svg, Path } from "react-native-svg";

const MapCanvas = forwardRef(
  ({ currentImageIndex, isAnnotationMode }, ref) => {
    const [paths, setPaths] = useState([]);
    const [currentColor, setCurrentColor] = useState("#000000");
    const currentPath = useRef("");

    useImperativeHandle(ref, () => ({
      clearAnnotations: () => setPaths([]),
      setColor: (color) => setCurrentColor(color),
    }));

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => isAnnotationMode,
        onPanResponderGrant: (evt, gestureState) => {
          const { locationX, locationY } = evt.nativeEvent;
          currentPath.current = `M${locationX} ${locationY}`;
        },
        onPanResponderMove: (evt, gestureState) => {
          const { locationX, locationY } = evt.nativeEvent;
          currentPath.current += ` L${locationX} ${locationY}`;
          setPaths((prev) => [
            ...prev.slice(0, -1),
            { d: currentPath.current, color: currentColor },
          ]);
        },
        onPanResponderRelease: () => {
          currentPath.current = "";
        },
      })
    ).current;

    useEffect(() => {
      // reset drawing path if needed
      currentPath.current = "";
    }, [currentImageIndex]);

    return (
      <View
        style={{ flex: 1, backgroundColor: "#fff" }}
        {...(isAnnotationMode ? panResponder.panHandlers : {})}
      >
        <Svg height="100%" width="100%">
          {paths.map((path, idx) => (
            <Path
              key={idx}
              d={path.d}
              stroke={path.color}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      </View>
    );
  }
);

export default MapCanvas;
