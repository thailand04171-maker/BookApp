// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';

// const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };


// const Profile = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [bookCount, setBookCount] = useState(0);


//   const handleLogout = async () => {

//     try {
//       const res = await fetch('http://10.0.2.2:3000/api/logout', {
//         method: 'POST',
//         credentials: 'include', // 🔥 ส่ง session cookie
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert('ออกจากระบบสำเร็จ');

//         // 🔥 reset stack กันย้อนกลับ
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Welcome' }],
//         });
//       } else {
//         alert(data.message || 'Logout failed');
//       }
//     } catch (err) {
//       console.log('❌ LOGOUT ERROR:', err);
//       alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
//     }
//   };

//   useEffect(() => {
//     fetch('http://10.0.2.2:3000/api/profile', {
//       method: 'GET',
//       credentials: 'include',
//     })
//       .then(async res => {
//         if (!res.ok) throw new Error('Unauthorized');

//         const data = await res.json();
//         console.log('PROFILE RESPONSE:', data);
//         setEmail(data.email);
//         setBookCount(data.bookCount);
//         console.log(data.bookCount);//undefined
        
//       })
//       .catch(() => { //** เอาออกไปก่อนอยากทำระบบ Guest เพิ่ม --> ถ้ามี Guest เข้าไม่ได้ โดนเด้ง */
//         // 🔥 ถ้า session หาย → เด้งออก 
//         // navigation.reset({
//         //   index: 0,
//         //   routes: [{ name: 'Welcome' }],
//         // });
//       });
//   }, []);

//   return (
//     <ImageBackground source={bgImage} style={styles.background}>
//       <View style={styles.overlay}>
//         <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
//         <View style={styles.container}>
//           <Text style={styles.title}>My Profile</Text>
//           <View style={styles.avatarContainer}>
//             <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} />
//           </View>
//           <View style={styles.infoBox}>
//             <Text>{email || "ไม่มีชื่อ"}</Text>
//             <Text>Books owned: {bookCount || "ไม่มีหนังสือ"}</Text>
//             <TouchableOpacity style={styles.editBtn}><Text>แก้ไขโปรไฟล์</Text></TouchableOpacity>
//             <TouchableOpacity style={styles.editBtn} onPress={handleLogout}>
//               <Text>ออกจากระบบ</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: { flex: 1 },
//   overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' },
//   header: { backgroundColor: '#000', padding: 15, alignItems: 'center' },
//   headerTitle: { color: '#fff', fontSize: 18 },
//   container: { padding: 20, alignItems: 'center' },
//   title: { fontSize: 40, fontWeight: 'bold', alignSelf: 'flex-start' },
//   avatarContainer: { borderWidth: 3, borderColor: 'orange', borderRadius: 75, marginVertical: 20 },
//   avatar: { width: 150, height: 150, borderRadius: 75 },
//   infoBox: { backgroundColor: 'rgba(255,255,255,0.5)', padding: 20, width: '100%', borderRadius: 10 },
//   editBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 5, marginTop: 20, alignSelf: 'flex-end' }
// });

// export default Profile;

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // 🔥 Import Picker

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };
const API_BASE = 'http://10.0.2.2:3000/api';

const Profile = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [bookCount, setBookCount] = useState(0);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150'); // Default

  // 🔥 1. Function to Pick and Upload Image
  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 500,
      maxWidth: 500,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }

      const asset = response.assets[0];
      setProfileImage(asset.uri); // Update UI immediately

      // 🔥 2. Upload to Server
      const formData = new FormData();
      formData.append('profilePic', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName || 'profile.jpg',
      });

      try {
        const res = await fetch(`${API_BASE}/upload-profile-pic`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.ok) {
          Alert.alert('สำเร็จ', 'อัปโหลดรูปภาพเรียบร้อยแล้ว');
        }
      } catch (err) {
        console.log('Upload Error:', err);
        Alert.alert('Error', 'ไม่สามารถอัปโหลดรูปภาพได้');
      }
    });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      }
    } catch (err) {
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
  };

  useEffect(() => {
    fetch(`${API_BASE}/profile`, { method: 'GET', credentials: 'include' })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setEmail(data.email);
        setBookCount(data.bookCount || 0);
        if (data.profilePic) setProfileImage(data.profilePic); // Load saved image from DB
      })
      .catch(() => {});
  }, []);

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
        <View style={styles.container}>
          <Text style={styles.title}>My Profile</Text>
          
          {/* 🔥 Profile Image with Orange Border */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.emailLabel}>{email || "ไม่มีชื่อ"}</Text>
            <Text style={styles.bookLabel}>Books owned: {bookCount || "ไม่มีหนังสือ"}</Text>
            
            {/* 🔥 This button now triggers the image picker */}
            <TouchableOpacity style={styles.editBtn} onPress={handlePickImage}>
              <Text style={styles.btnText}>แก้ไขโปรไฟล์ (เปลี่ยนรูป)</Text>
            </TouchableOpacity>

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
  header: { backgroundColor: '#000', padding: 15, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18 },
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 40, fontWeight: 'bold', alignSelf: 'flex-start', color: '#000' },
  avatarContainer: { borderWidth: 3, borderColor: 'orange', borderRadius: 75, marginVertical: 20, overflow: 'hidden' },
  avatar: { width: 150, height: 150, borderRadius: 75 },
  infoBox: { backgroundColor: 'rgba(255,255,255,0.8)', padding: 20, width: '100%', borderRadius: 15 },
  emailLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  bookLabel: { fontSize: 16, color: '#555', marginBottom: 20 },
  editBtn: { backgroundColor: '#444', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  logoutBtn: { backgroundColor: '#D32F2F' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default Profile;