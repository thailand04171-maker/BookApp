import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };


const Profile = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleLogout = async () => {

    try {
      const res = await fetch('http://10.0.2.2:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // 🔥 ส่ง session cookie
      });

      const data = await res.json();

      if (res.ok) {
        alert('ออกจากระบบสำเร็จ');

        // 🔥 reset stack กันย้อนกลับ
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      } else {
        alert(data.message || 'Logout failed');
      }
    } catch (err) {
      console.log('❌ LOGOUT ERROR:', err);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
  };

  useEffect(() => {
    fetch('http://10.0.2.2:3000/api/profile', {
      method: 'GET',
      credentials: 'include',

    })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        setEmail(data.email);
      })
      .catch(() => { //** เอาออกไปก่อนอยากทำระบบ Guest เพิ่ม --> ถ้ามี Guest เข้าไม่ได้ โดนเด้ง */
        // 🔥 ถ้า session หาย → เด้งออก 
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'Welcome' }],
        // });
      });
  }, []);

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
        <View style={styles.container}>
          <Text style={styles.title}>My Profile</Text>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} />
          </View>
          <View style={styles.infoBox}>
            <Text>{email || "ไม่มีชื่อ"}</Text>
            <Text>Books owned: 152</Text>
            <Text>Favorite Books: 23</Text>
            <TouchableOpacity style={styles.editBtn}><Text>แก้ไขโปรไฟล์</Text></TouchableOpacity>
            <TouchableOpacity style={styles.editBtn} onPress={handleLogout}>
              <Text>ออกจากระบบ</Text>
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
  title: { fontSize: 40, fontWeight: 'bold', alignSelf: 'flex-start' },
  avatarContainer: { borderWidth: 3, borderColor: 'orange', borderRadius: 75, marginVertical: 20 },
  avatar: { width: 150, height: 150, borderRadius: 75 },
  infoBox: { backgroundColor: 'rgba(255,255,255,0.5)', padding: 20, width: '100%', borderRadius: 10 },
  editBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 5, marginTop: 20, alignSelf: 'flex-end' }
});

export default Profile;