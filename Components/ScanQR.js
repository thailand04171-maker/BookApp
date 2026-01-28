import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // นำเข้าส่วนกล้องใหม่

const ScanQR = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions(); // ระบบขอสิทธิ์เข้าถึงกล้อง
  const [scanned, setScanned] = useState(false); // สถานะการแสกน

  // 1. จัดการเรื่องการขออนุญาตกล้อง
  if (!permission) return <View style={styles.background} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.scanText}>เราขออนุญาตใช้กล้องเพื่อแสกนหนังสือนะครับ</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.manualButtonText}>อนุญาตใช้งานกล้อง</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. ฟังก์ชันเมื่อแสกนเจอ Barcode หรือ QR Code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      "สำเร็จ!",
      `พบรหัสหนังสือ: ${data}`,
      [
        { 
          text: "OK", 
          onPress: () => {
            setScanned(false);
            navigation.navigate('Home', { screen: 'Main' }); // นำทางไปหน้า Main
          } 
        },
        { text: "แสกนใหม่", onPress: () => setScanned(false), style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.background}>
      {/* ใช้ CameraView แทน ImageBackground เพื่อให้เห็นภาพจากกล้องจริง */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeSettings={{
          barcodeTypes: ["qr", "ean13", "code128"], // รองรับทั้ง QR และ บาร์โค้ดหนังสือทั่วไป
        }}
      >
        {/* ใช้ Overlay และ UI เดิมของคุณทั้งหมด */}
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>scan</Text>
          </View>
          
          <View style={styles.scannerContainer}>
            <View style={styles.viewfinder}>
               {/* กรอบสีแดงดีไซน์เดิมของคุณ */}
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
      </CameraView>
    </View>
  );
};

// Styles เดิมที่คุณเขียนไว้เป๊ะๆ
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  background: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  header: { backgroundColor: '#000', padding: 15, alignItems: 'center', paddingTop: 50 },
  headerTitle: { color: '#fff', fontSize: 18 },
  scannerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  viewfinder: { width: 250, height: 150, position: 'relative' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: 'red' },
  scanText: { color: '#fff', marginTop: 20, fontSize: 16 },
  manualButton: { marginTop: 40, borderBottomWidth: 1, borderBottomColor: '#fff'},
  manualButtonText: { color: '#fff', fontSize: 16, fontWeight: '600'},
  permissionButton: { backgroundColor: '#D32F2F', padding: 15, borderRadius: 10, marginTop: 10 }
});

export default ScanQR;