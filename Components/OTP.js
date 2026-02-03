import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const bgImage = {
  uri: "https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg",
};

const OTP = ({ navigation, route }) => {
  const { email } = route.params; // ✅ รับ email จาก Sign_in
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    
    // 1. Update the value (this allows deletion to happen)
    newOtp[index] = text.slice(-1); 
    setOtp(newOtp);

    // 2. Move FORWARD only if a number was added
    if (text !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    // 3. This catches the Backspace when the box is ALREADY empty
    if (nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Jump focus back
        inputRefs.current[index - 1].focus();
        // OPTIONAL: If you want it to also delete the number in the previous box 
        // immediately when it jumps back, uncomment the lines below
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      alert("กรุณากรอก OTP ให้ครบ 6 หลัก");
      return;
    }

    try {
      const res = await fetch("https://bookapp-h41h.onrender.com/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("ยืนยัน OTP สำเร็จ");
        navigation.navigate("Home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  };

  // ✅ RESEND OTP
  const handleResend = async () => {
    try {
      await fetch("https://bookapp-h41h.onrender.com/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
      alert("ส่ง OTP ใหม่เรียบร้อย");
    } catch (err) {
      alert("ส่ง OTP ไม่สำเร็จ");
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.headerText}>OTP</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  
                  // ADD THESE TWO:
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                  maxLength={1} 
                  
                  ref={(ref) => (inputRefs.current[index] = ref)}
                />
  
              ))}
            </View>

            {/* 🔁 RESEND */}
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Send OTP again?</Text>
            </TouchableOpacity>

            {/* ✅ SUBMIT */}
            <TouchableOpacity style={styles.submitButton} onPress={handleVerifyOtp}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            {/* 🔙 BACK */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Sign_in")}
              style={styles.backButtonContainer}
            >
              <Text style={styles.backLink}>Go back to Sign up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  keyboardView: { flex: 1 },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 50,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  otpInput: {
    backgroundColor: "#fff",
    width: 45,
    height: 50,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  resendText: { color: "#fff", marginBottom: 30 },
  submitButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 25,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  backButtonContainer: { marginTop: 30 },
  backLink: {
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default OTP;
