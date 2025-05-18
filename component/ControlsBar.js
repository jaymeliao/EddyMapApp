import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ZoomScales from "./ZoomScales";
const ControlsBar = ({ undo, clearAnnotations, switchToPreviousImage, switchToNextImage, zoomIn, zoomOut, toggleAnnotationMode, isAnnotationMode }) => (
  <View style={styles.controlsBar}>
    {
      isAnnotationMode ? (
        <TouchableOpacity onPress={toggleAnnotationMode} style={styles.button}>
          <Icon name="edit" size={30} color="#000" />
        </TouchableOpacity>
      ) : (

        <TouchableOpacity onPress={toggleAnnotationMode} style={styles.button}>
          <Icon name="swipe" size={30} color="#000" />
        </TouchableOpacity>
      )
    }


<View style={{display: "flex", flexDirection: "row", gap: 10}}>
    <ZoomScales
      zoomIn={zoomIn}
      zoomOut={zoomOut}
    />
    <TouchableOpacity onPress={undo} style={styles.button}>
      <Icon name="undo" size={30} color="#000" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={clearAnnotations}>
      <Icon name="delete" size={24} color="#ff6666" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={switchToPreviousImage}>
      <Icon name="arrow-back" size={30} color="#000" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={switchToNextImage}>
      <Icon name="arrow-forward" size={30} color="#000" />
    </TouchableOpacity>
  </View>
  </View>
);

const styles = StyleSheet.create({
  controlsBar: {
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    gap: 15,

  },
  imageControls: {
    display: "flex",
    flexDirection: "row",
  },

  button: {
    paddingTop: 10,
  },
});

export default ControlsBar;
