import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import {
  View,
  Image,
  PanResponder,
  Dimensions,
  StyleSheet
} from 'react-native';
import Svg, { G, Path, Image as SvgImage } from 'react-native-svg';

/**
 * MapCanvas
 * Props:
 * - images: array of image sources (require or {uri:string})
 * - currentImageIndex: index of the current image to show
 * - isAnnotationMode: bool,
 * - selectedColor: string, the pen's color
 */
const MapCanvas = forwardRef((props, ref) => {
  const {
    images = [], 
    currentImageIndex = 0,
    isAnnotationMode = false,
    selectedColor = 'black'
  } = props;

  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const [strokes, setStrokes] = useState([]);         // stroke lines { points: [{x,y},...], color }
  const [currentPoints, setCurrentPoints] = useState([]); // current drawing points

  //the following refs are used to solve the closure capture problem, keeping the latest values available
  const offsetRef = useRef({ x: offsetX, y: offsetY });
  const scaleRef = useRef(scale);
  const currentPointsRef = useRef([]);

  useEffect(() => {
    offsetRef.current = { x: offsetX, y: offsetY };
  }, [offsetX, offsetY]);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  useEffect(() => {
    currentPointsRef.current = currentPoints;
  }, [currentPoints]);

  useEffect(() => {
    const loadImage = async () => {
      if (!images || images.length === 0) return;
      const src = images[currentImageIndex];
      if (!src) return;

      // get image size
      if (typeof src === 'number') {
        const { width, height } = Image.resolveAssetSource(src);
        setImageWidth(width);
        setImageHeight(height);
      } else if (src.uri) {
        Image.getSize(
          src.uri,
          (width, height) => {
            setImageWidth(width);
            setImageHeight(height);
          },
          (err) => {
            console.warn('Failed to get image size:', err);
          }
        );
      }

      
      setScale(1);
      setOffsetX(0);
      setOffsetY(0);
      setStrokes([]);
      setCurrentPoints([]);
    };
    loadImage();
  }, [currentImageIndex, images]);

  // when the size of the container or image changes, recalculate the initial offset to center the image
  useEffect(() => {
    if (containerWidth === 0 || containerHeight === 0) return;
    if (imageWidth === 0 || imageHeight === 0) return;

    const initOffsetX = (containerWidth - imageWidth * scaleRef.current) / 2;
    const initOffsetY = (containerHeight - imageHeight * scaleRef.current) / 2;
    setOffsetX(initOffsetX);
    setOffsetY(initOffsetY);
    offsetRef.current = { x: initOffsetX, y: initOffsetY };
  }, [containerWidth, containerHeight, imageWidth, imageHeight]);

  const clampOffset = (x, y, scl = scaleRef.current) => {
    let minX, maxX, minY, maxY;
    if (imageWidth * scl > containerWidth) {
      minX = containerWidth - imageWidth * scl;
      maxX = 0;
    } else {
      const centerX = (containerWidth - imageWidth * scl) / 2;
      minX = maxX = centerX;
    }
    if (imageHeight * scl > containerHeight) {
      minY = containerHeight - imageHeight * scl;
      maxY = 0;
    } else {
      const centerY = (containerHeight - imageHeight * scl) / 2;
      minY = maxY = centerY;
    }
    // 嵌制偏移量到允許的範圍
    const clampedX = Math.min(Math.max(x, minX), maxX);
    const clampedY = Math.min(Math.max(y, minY), maxY);
    return { x: clampedX, y: clampedY };
  };


  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (isAnnotationMode) {
          // start drawing: record the current point
          const { locationX, locationY } = evt.nativeEvent;
          const x = (locationX - offsetRef.current.x) / scaleRef.current;
          const y = (locationY - offsetRef.current.y) / scaleRef.current;
          currentPointsRef.current = [{ x, y }];
          setCurrentPoints([{ x, y }]);
        } else {
          // record the current offset as the start point
          // no special operation needed, can be used for subsequent dx accumulation
          // (or use offsetRef.current to store the current offset)
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isAnnotationMode) {
          const { locationX, locationY } = evt.nativeEvent;
          const x = (locationX - offsetRef.current.x) / scaleRef.current;
          const y = (locationY - offsetRef.current.y) / scaleRef.current;
          
          currentPointsRef.current = currentPointsRef.current.concat({ x, y });
          setCurrentPoints(currentPointsRef.current);
        } else {
          const dx = gestureState.dx;
          const dy = gestureState.dy;
          const startX = offsetRef.current.x;
          const startY = offsetRef.current.y;
          const newX = startX + dx;
          const newY = startY + dy;
          const clamped = clampOffset(newX, newY, scaleRef.current);
          setOffsetX(clamped.x);
          setOffsetY(clamped.y);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (isAnnotationMode) {
          if (currentPointsRef.current.length > 0) {
            const stroke = {
              points: [...currentPointsRef.current],
              color: selectedColor
            };
            setStrokes(prev => [...prev, stroke]);
          }
          currentPointsRef.current = [];
          setCurrentPoints([]);
        } else {
          // no need to do anything after dragging
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // expose methods to parent component
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      const newScale = Math.min(scale + 0.5, 3);
      setScale(newScale);
      //re-calculate the offset after zooming
      const clamped = clampOffset(offsetRef.current.x, offsetRef.current.y, newScale);
      setOffsetX(clamped.x);
      setOffsetY(clamped.y);
    },
    zoomOut: () => {
      const newScale = Math.max(scale - 0.5, 1);
      setScale(newScale);
      const clamped = clampOffset(offsetRef.current.x, offsetRef.current.y, newScale);
      setOffsetX(clamped.x);
      setOffsetY(clamped.y);
    },
    undo: () => {
      //刪除最後一筆刪除最後一筆
      setStrokes(prev => prev.slice(0, -1));
    },
    clearAnnotations: () => {
      setStrokes([]);
    }
  }));

  // layout event is triggered when the component is mounted or resized
  const onLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  };

  // render the path of the svg, convert the points array to a path string
  const renderPathFromPoints = points => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      path += ` L ${p.x} ${p.y}`;
    }
    return path;
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Svg
        width={containerWidth}
        height={containerHeight}
        style={styles.svgContainer}
      >
        <G
          transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}
        >
          {/* 背景圖片 */}
          {imageWidth > 0 && imageHeight > 0 && (
            <SvgImage
              x={0}
              y={0}
              width={imageWidth}
              height={imageHeight}
              preserveAspectRatio="xMidYMid slice"
              href={images[currentImageIndex]}
            />
          )}
          {/* 已完成的筆畫 */}
          {strokes.map((stroke, idx) => (
            <Path
              key={`stroke-${idx}`}
              d={renderPathFromPoints(stroke.points)}
              stroke={stroke.color}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {/* 當前正在繪製的筆畫 */}
          {currentPoints.length > 0 && (
            <Path
              d={renderPathFromPoints(currentPoints)}
              stroke={selectedColor}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </G>
      </Svg>
      {/* 蓋在最上方 PanResponder 區域 */}
      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    justifyContent: 'flex-start',
  },
  svgContainer: {
    flex: 1,
  }
});

export default MapCanvas;
