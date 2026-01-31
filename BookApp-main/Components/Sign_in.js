// Sign_in.js (Register Screen)
//D:\ApiwatSpice\3term2\StartUp\TONTAN\BookApp\Components\Sign_in.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Replace with your actual assets
const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };
const googleIcon = { uri: 'https://via.placeholder.com/30/ffffff/000000?text=G' };
const facebookIcon = { uri: 'https://via.placeholder.com/30/ffffff/000000?text=F' };
const eyeOpenIcon = { uri: 'https://via.placeholder.com/20/000000/ffffff?text=O' };
const eyeClosedIcon = { uri: 'https://via.placeholder.com/20/000000/ffffff?text=C' };

const Sign_in = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

const handleRegister = async () => {
    console.log(email, password, confirmPassword);

    // 1. Check for empty fields
    if (!email || !password || !confirmPassword) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    // 2. Email Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกใหม่อีกครั้ง");
      setEmail(''); // Clear the email input box
      return;
    }

    // 3. Password Match Check
    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const res = await fetch("http://10.0.2.2:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("กรอกรหัส OTP ที่ส่งไปใน Email ของคุณ");
        navigation.navigate("OTP", { email });
      } else {
        alert(data.message || "สมัครไม่สำเร็จ");
      }
    } catch (err) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
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
                placeholder=""
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
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                  <Image source={isPasswordVisible ? eyeOpenIcon : eyeClosedIcon} style={styles.iconImage} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
                  <Image source={isConfirmPasswordVisible ? eyeOpenIcon : eyeClosedIcon} style={styles.iconImage} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.signupButton} onPress={handleRegister}>
                <Text style={styles.signupButtonText}>Sign up</Text>
              </TouchableOpacity>

              <Text style={styles.orText}>or Sign in with</Text>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={googleIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={facebookIcon} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>

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
  iconImage: { width: 24, height: 24, resizeMode: 'contain' },
  signupButton: { backgroundColor: '#D32F2F', borderRadius: 25, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signupButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  orText: { color: '#fff', textAlign: 'center', marginVertical: 20 },
  socialButtonsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  socialButton: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 },
  socialIcon: { width: 30, height: 30, resizeMode: 'contain' },
  loginLink: { color: '#fff', textAlign: 'center', marginTop: 10 },
});

export default Sign_in;