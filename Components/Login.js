// Login.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Replace with your actual assets
const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };
const googleIcon = { uri: 'https://via.placeholder.com/30/ffffff/000000?text=G' };
const facebookIcon = { uri: 'https://via.placeholder.com/30/ffffff/000000?text=F' };
const eyeOpenIcon = { uri: 'https://via.placeholder.com/20/000000/ffffff?text=O' };
const eyeClosedIcon = { uri: 'https://via.placeholder.com/20/000000/ffffff?text=C' };

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const res = await fetch("http://192.168.0.254:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("เข้าสู่ระบบสำเร็จ");
        navigation.navigate("Home");
      } else {
        alert(data.message || "เข้าสู่ระบบไม่สำเร็จ");
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
            <Text style={styles.headerText}>log in</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
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

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} >
                <Text style={styles.loginButtonText}>Log in</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>

              <Text style={styles.orText}>or Log in with</Text>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={googleIcon} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Image source={facebookIcon} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('Sign_in')}>
                <Text style={styles.signupLink}>Doesn't have an Account? Sign up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* --- ปุ่ม Dev Mode สำหรับ Skip ไปหน้า Main --- */}
        <TouchableOpacity 
          style={styles.devButton} 
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.devButtonText}> GUEST </Text>
        </TouchableOpacity>
        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
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
  loginButton: { backgroundColor: '#D32F2F', borderRadius: 25, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  forgotPasswordText: { color: '#fff', textAlign: 'center', marginTop: 15 },
  orText: { color: '#fff', textAlign: 'center', marginVertical: 20 },
  socialButtonsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  socialButton: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 },
  socialIcon: { width: 30, height: 30, resizeMode: 'contain' },
  signupLink: { color: '#fff', textAlign: 'center', marginTop: 10 },
  // --- Style สำหรับปุ่ม Dev Mode ---
  devButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // ขาวโปร่งแสง
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  devButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});



export default Login;

//Hello guys