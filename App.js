import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import MapCanvas from "./component/MapCanvas";
export default function App() {
  return (
 
      <MapCanvas/>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f38020",
  },
  greet: {
    color: "red",
  },
});
