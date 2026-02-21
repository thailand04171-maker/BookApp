// Sign_in.js (Register Screen)
import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };

const Sign_in = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const handleRegister = async () => {
    // 1. เช็กช่องว่าง
    if (!email || !password || !confirmPassword) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // 2. เช็กรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("ข้อผิดพลาด", "รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง");
      setEmail(''); 
      return;
    }

    // 3. ตรวจสอบความปลอดภัยของรหัสผ่าน (Password Validation)
    // เงื่อนไข: ยาว 8 ตัวอักษรขึ้นไป, มีตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่ และตัวเลข
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "รหัสผ่านไม่ปลอดภัย",
        "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวพิมพ์เล็ก (a-z) ตัวพิมพ์ใหญ่ (A-Z) และตัวเลข (0-9) อย่างน้อย 1 ตัว"
      );
      return;
    }

    // 4. เช็กรหัสผ่านและการยืนยันรหัสผ่านว่าตรงกันหรือไม่
    if (password !== confirmPassword) {
      Alert.alert("ข้อผิดพลาด", "รหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://bookapp-wgle.onrender.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        Alert.alert("สำเร็จ", "สมัครสมาชิกสำเร็จ"); 
        navigation.navigate("Login");
      } else {
        Alert.alert("ข้อผิดพลาด", data.message || "สมัครไม่สำเร็จ");
      }
    } catch (err) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headerText}>Register</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="example@mail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                  <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
                  <Ionicons name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.signupButton, isLoading && styles.signupButtonDisabled]} 
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signupButtonText}>Sign up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.systemLine} />

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Already have an Account? Log in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  systemLine: {
    height: 2,
    backgroundColor: '#ffffff',
    margin: 20
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  headerText: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 30 },
  form: { width: '100%' },
  label: { color: '#fff', marginBottom: 5, marginLeft: 10 },
  input: { backgroundColor: '#fff', borderRadius: 25, height: 50, paddingHorizontal: 20, marginBottom: 15 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, height: 50, paddingHorizontal: 20, marginBottom: 15 },
  passwordInput: { flex: 1, height: 50 },
  eyeIcon: { padding: 10 },
  signupButton: { backgroundColor: '#D32F2F', borderRadius: 25, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signupButtonDisabled: { backgroundColor: '#e57373' }, 
  signupButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginLink: { color: '#fff', textAlign: 'center', marginTop: 10 },
});

export default Sign_in;