import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg'};


const Profile = ({navigation}) => {
  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
        <View style={styles.container}>
          <Text style={styles.title}>My Profile</Text>
          <View style={styles.avatarContainer}>
             <Image source={{uri: 'https://via.placeholder.com/150'}} style={styles.avatar} />
          </View>
          <View style={styles.infoBox}>
            <Text>BlackSmithBoy@gmail.com</Text>
            <Text>UID: 14039849</Text>
            <Text>Books owned: 152</Text>
            <Text>Favorite Books: 23</Text>
            <TouchableOpacity style={styles.editBtn}><Text>แก้ไขโปรไฟล์</Text></TouchableOpacity>
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Welcome')}><Text>ออกจากระบบ</Text></TouchableOpacity>
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