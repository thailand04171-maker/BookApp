import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, ScrollView } from 'react-native';

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg'};

const Book_Decs = ({ route, navigation }) => {
  // รับข้อมูลหนังสือจากหน้าที่กดมา (ถ้ามี)
  const { title, image, description, pdfUrl } = route.params || { 
    title: "Morning Glory Flowers", 
    image: 'https://via.placeholder.com/250x350',
    description: "ไม่มีรายละเอียด",
    pdfUrl: null
  };

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>รายละเอียดหนังสือ</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {/* Book Cover */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.bookCover} />
          </View>

          {/* Book Info */}
          <View style={styles.infoSection}>
            <Text style={styles.bookTitle}>{title}</Text>
            <Text style={styles.authorText}>โดย: National Diet Library</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.descriptionTitle}>เรื่องย่อ</Text>
            <Text style={styles.descriptionText}>
              {description}
            </Text>
          </View>

          {/* Read Button */}
          <TouchableOpacity 
            style={styles.readButton}
            onPress={() => navigation.navigate('Reader', { title: title, pdfUrl: pdfUrl })} // ส่ง pdfUrl ไปหน้า Reader
            >
            <Text style={styles.readButtonText}>อ่าน E-book</Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.85)' },
  header: { backgroundColor: '#000', flexDirection: 'row', padding: 20, alignItems: 'center', paddingTop: 50 },
  backBtn: { color: '#fff', fontSize: 24, marginRight: 20 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  container: { padding: 20, alignItems: 'center' },
  imageContainer: {
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 25,
  },
  bookCover: { width: 220, height: 320, borderRadius: 10 },
  infoSection: { width: '100%', paddingHorizontal: 10 },
  bookTitle: { fontSize: 26, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 5 },
  authorText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 15 },
  descriptionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  descriptionText: { fontSize: 16, color: '#444', lineHeight: 24 },
  readButton: { 
    backgroundColor: '#D32F2F', 
    width: '100%', 
    height: 55, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 30,
    marginBottom: 50 
  },
  readButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default Book_Decs;