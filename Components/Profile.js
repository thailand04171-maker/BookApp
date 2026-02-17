import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };
const API_BASE = 'https://bookapp-h41h.onrender.com/api';
const SERVER_URL = 'https://bookapp-h41h.onrender.com';

const Profile = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [bookCount, setBookCount] = useState(0);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    // 1. Better status check logic
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery permissions are needed to change your avatar.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];

      // Update local UI immediately for responsiveness
      setProfileImage(selectedAsset.uri);

      // Start the upload process
      uploadAvatar(selectedAsset);
    }
  };

  const uploadAvatar = async (asset) => {
    setUploading(true);

    const formData = new FormData();
    const uri = asset.uri;
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('profilePic', {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      name: filename,
      type,
    });

    try {
      const token = await AsyncStorage.getItem("token");
      console.log("TOKEN:", token);
      const res = await fetch(
        'http://10.0.2.2:3000/api/upload-profile-pic',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,   // 🔥 สำคัญ
          },
          body: formData,
        }
      );

      const responseData = await res.json();
      console.log('STATUS:', res.status);
      console.log('RESPONSE:', responseData);

      if (res.ok) {
        Alert.alert('สำเร็จ', 'อัปโหลดรูปภาพเรียบร้อยแล้ว');
        await fetchProfile();
        if (responseData.profilePic) {
          const fullUrl = responseData.profilePic.startsWith('http')
            ? responseData.profilePic
            : `${SERVER_URL}${responseData.profilePic}`;
          setProfileImage(fullUrl);
        }
      } else {
        Alert.alert('ล้มเหลว', responseData.message || 'อัปโหลดไม่สำเร็จ');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      Alert.alert('Error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Note: Added timeout or error handling for network issues
      const res = await fetch(`http://10.0.2.2:3000/api/logout`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      } else {
        Alert.alert('Logout failed', 'Could not end session');
      }
    } catch (err) {
      Alert.alert('Error', 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
    }
  };
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        'http://10.0.2.2:3000/api/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();

      setEmail(data.email);
      setBookCount(data.bookCount || 0);

      if (data.profilePic) {
        const fullUrl = data.profilePic.startsWith('http')
          ? data.profilePic
          : `${SERVER_URL}${data.profilePic}`;
        setProfileImage(fullUrl);
      }

    } catch (err) {
      console.log("Fetch Profile Error:", err.message);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
        <View style={styles.container}>
          <Text style={styles.title}>My Profile</Text>

          <TouchableOpacity
            onPress={handlePickImage}
            activeOpacity={0.8}
            disabled={uploading}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profileImage }}
                style={styles.avatar}
                // Handles broken links
                defaultSource={{ uri: 'https://via.placeholder.com/150' }}
              />

              {uploading ? (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator color="orange" size="large" />
                </View>
              ) : (
                <View style={styles.cameraIconBadge}>
                  <Text style={{ fontSize: 14 }}>📷</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.emailLabel}>{email || "Loading..."}</Text>
            <Text style={styles.bookLabel}>Books owned: {bookCount}</Text>

            <TouchableOpacity style={[styles.editBtn, styles.logoutBtn]} onPress={handleLogout}>
              <Text style={styles.btnText}>ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' },
  header: { backgroundColor: '#000', padding: 15, alignItems: 'center', paddingTop: 45 },
  headerTitle: { color: '#fff', fontSize: 18 },
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 36, fontWeight: 'bold', alignSelf: 'flex-start', color: '#000', marginBottom: 10 },
  avatarContainer: {
    borderWidth: 5,
    borderColor: 'orange', // The Yellow/Orange Circle
    borderRadius: 85,
    marginVertical: 20,
    position: 'relative',
    elevation: 8,
    backgroundColor: '#fff',
  },
  avatar: { width: 160, height: 160, borderRadius: 80 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 80,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'orange',
    elevation: 4,
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    width: '100%',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  emailLabel: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  bookLabel: { fontSize: 16, color: '#666', marginBottom: 25 },
  editBtn: { backgroundColor: '#444', height: 55, borderRadius: 12, marginTop: 10, justifyContent: 'center', alignItems: 'center' },
  logoutBtn: { backgroundColor: '#D32F2F' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default Profile; 