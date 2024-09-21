import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function SearchPages() {
  return (
    <View style={styles.container}>
      <Text style={styles.searchLabel}>Floor number</Text>
      <TextInput style={styles.searchInput} placeholder="eg: 3"></TextInput>
      <Text style={styles.searchLabel}>Room number</Text>
      <TextInput style={styles.searchInput} placeholder="eg: 412"></TextInput>
      <Text style={styles.searchLabel}>Department Name</Text>
      <TextInput style={styles.searchInput} placeholder="NICU"></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f38020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchLabel:{
    fontSize:24,
    padding:12,
    color:"#1f60ac",
  },
  searchInput:{
    backgroundColor:"#fff",
    color:"#1f60ac",
    padding:12,
    fontSize:24,
    width:"90%",
    borderRadius: 50,
    marginBottom:12
  }
});
