import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native';

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };

const AddbyCode = ({ navigation }) => {
  const [bookCode, setBookCode] = useState('');

  const handleAddBook = async () => {
    if (bookCode.trim() === "") {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกรหัสหนังสือ");
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/api/add-by-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: bookCode.trim() }),
      });

      const text = await res.text();
      console.log('RAW RESPONSE:', text);

      let data = null;
      try {
        data = JSON.parse(text);
        console.log(data);
        
      } catch { }

      if (!res.ok) {
        Alert.alert("ไม่สำเร็จ", data?.message || "เพิ่มหนังสือไม่สำเร็จ");
        return;
      }

      Alert.alert("สำเร็จ!", "เพิ่มหนังสือเข้าสู่คลังของคุณแล้ว");
      setBookCode("");
    } catch (err) {
      console.log("ADD BOOK ERROR:", err);
      Alert.alert("ผิดพลาด", "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } 
  };


  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add by Code</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>กรอกรหัสหนังสือของคุณ</Text>
          <TextInput
            style={styles.input}
            placeholder="เช่น B12345"
            value={bookCode}
            onChangeText={setBookCode}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleAddBook}>
            <Text style={styles.submitText}>เพิ่มหนังสือ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  header: { backgroundColor: '#000', flexDirection: 'row', padding: 20, alignItems: 'center', paddingTop: 50 },
  backBtn: { color: '#fff', fontSize: 24, marginRight: 20 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  label: { color: '#fff', fontSize: 18, marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 10, height: 55, paddingHorizontal: 20, fontSize: 18, marginBottom: 25 },
  submitButton: { backgroundColor: '#D32F2F', borderRadius: 10, height: 55, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default AddbyCode;