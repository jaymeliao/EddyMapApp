import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import MapCanvas from "./component/MapCanvas";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.searchArea}>
        <Text>hello</Text>
      </View>
      <View style={styles.mapArea}>
        <MapCanvas />
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
    flex: 2,  // 20% of the screen height
    backgroundColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
  },
  mapArea: {
    flex: 8,  // 80% of the screen height
    backgroundColor: "#fff",
  },
});
