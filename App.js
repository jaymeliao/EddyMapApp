import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import MapCanvas from "./component/MapCanvas";
import MapCanvasSwitchable from "./component/MapCanvasSwitchable";
import MapSwitchableZoomable from "./component/MapSwitchableZoomable";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.searchArea}>
        <Text>To be Continue: Search Map by floor number etc</Text>
      </View>
      <View style={styles.mapArea}>
        <MapSwitchableZoomable />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f38020",
  },
  searchArea: {
    flex: 2, // 20% of the screen height
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  mapArea: {
    flex: 8, // 80% of the screen height
    backgroundColor: "#fff",
  },
  
});
