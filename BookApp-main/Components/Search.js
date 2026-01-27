import React from 'react';
import { StyleSheet, View, TextInput, ImageBackground, TouchableOpacity, Text } from 'react-native';

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg'};

const Search = ({ navigation }) => {
  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
           <Text style={styles.headerTitle}>ค้นหา</Text>
        </View>
        <View style={styles.searchBarContainer}>
           <TextInput style={styles.searchInput} placeholder="Morn" />
        </View>
        {/* แสดงผลการค้นหาตรงนี้ */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' },
  header: { backgroundColor: '#000', flexDirection: 'row', padding: 15, alignItems: 'center' },
  backBtn: { color: '#fff', fontSize: 24, marginRight: 20 },
  headerTitle: { color: '#fff', fontSize: 18 },
  searchBarContainer: { padding: 20 },
  searchInput: { backgroundColor: '#fff', borderRadius: 25, height: 50, paddingHorizontal: 20 }
});

export default Search;