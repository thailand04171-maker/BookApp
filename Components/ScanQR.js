import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg'};

const ScanQR = ({ navigation }) => {
  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}><Text style={styles.headerTitle}>scan</Text></View>
        <View style={styles.scannerContainer}>
          <View style={styles.viewfinder}>
             {/* กรอบสีแดง */}
             <View style={[styles.corner, {top: 0, left: 0, borderLeftWidth: 5, borderTopWidth: 5}]} />
             <View style={[styles.corner, {top: 0, right: 0, borderRightWidth: 5, borderTopWidth: 5}]} />
             <View style={[styles.corner, {bottom: 0, left: 0, borderLeftWidth: 5, borderBottomWidth: 5}]} />
             <View style={[styles.corner, {bottom: 0, right: 0, borderRightWidth: 5, borderBottomWidth: 5}]} />
          </View>
          <Text style={styles.scanText}>-โปรดให้ Barcode อยู่ตรงกลาง-</Text>

          <TouchableOpacity 
            style={styles.manualButton} 
            onPress={() => navigation.navigate('AddbyCode')}>
            <Text style={styles.manualButtonText}>ใช้รหัส Code จากหนังสือแทน</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  header: { backgroundColor: '#000', padding: 15, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18 },
  scannerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  viewfinder: { width: 250, height: 150, position: 'relative' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: 'red' },
  scanText: { color: '#fff', marginTop: 20, fontSize: 16 },
  manualButton: { marginTop: 40, borderBottomWidth: 1, borderBottomColor: '#fff'},
  manualButtonText: { color: '#fff', fontSize: 16, fontWeight: '600'}
});

export default ScanQR;