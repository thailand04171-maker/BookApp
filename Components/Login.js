// Login.js
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const bgImage = {
  uri: "https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg",
};
const eyeOpenIcon = { uri: "https://via.placeholder.com/20/000000/ffffff?text=O" };
const eyeClosedIcon = { uri: "https://via.placeholder.com/20/000000/ffffff?text=C" };

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      const res = await fetch(
        "https://bookapp-h41h.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      // ✅ LOGIN SUCCESS
      if (res.ok) {
        alert("เข้าสู่ระบบสำเร็จ");
        navigation.navigate("Home");
        return;
      }

      // 🔒 ยังไม่ verify OTP
      if (res.status === 403) {
        alert("กรุณายืนยัน OTP ก่อนเข้าสู่ระบบ");
        navigation.navigate("OTP", {
          email,
          autoResend: true,
        });
        return;
      }

      // ❌ ERROR อื่น
      alert(data.message || "เข้าสู่ระบบไม่สำเร็จ");
    } catch (err) {
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <StatusBar style="light" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Log in</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Image
                  source={isPasswordVisible ? eyeOpenIcon : eyeClosedIcon}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Sign_in")}>
              <Text style={styles.signupLink}>
                Doesn't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* DEV MODE */}
        <TouchableOpacity
          style={styles.devButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.devButtonText}>GUEST</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  label: { color: "#fff", marginLeft: 10, marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  passwordInput: { flex: 1 },
  eyeIcon: { width: 24, height: 24 },
  loginButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  signupLink: { color: "#fff", textAlign: "center", marginTop: 10 },
  devButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  devButtonText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});

export default Login;
