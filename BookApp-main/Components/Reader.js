import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg'};

const Reader = ({ route, navigation }) => {
  const { title } = route.params || { title: "กำลังอ่าน..." };

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.darkOverlay}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="light" />
          
          {/* Header Bar - ดีไซน์แบบโปร่งแสง */}
          <View style={styles.header}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.closeBtn}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // เพิ่มพื้นที่กดรอบๆ ปุ่ม
            >
                <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            </View>
            <TouchableOpacity style={styles.settingsBtn}>
              <Text style={styles.settingsText}>Aa</Text>
            </TouchableOpacity>
          </View>

          {/* Book Content - ตัวอักษรสีขาวบนพื้นหลังเข้ม */}
          <ScrollView contentContainerStyle={styles.readArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>{title}</Text>
            <View style={styles.textUnderline} />
            
            <Text style={styles.bookContent}>
              กาลครั้งหนึ่งนานมาแล้ว... ณ ใจกลางห้องสมุดเวทมนตร์ 
              เนื้อหาที่ออเจ้ากำลังอ่านอยู่นี้ถูกดึงมาจากระบบ E-book ลับ
              {"\n\n"}
              การออกแบบใหม่นี้ใช้ตัวอักษรสีขาว (White Contrast) บนพื้นหลังห้องสมุดที่ปรับให้มืดลง 
              เพื่อให้ความรู้สึกเหมือนออเจ้ากำลังนั่งอ่านหนังสืออยู่ในมุมมืดของห้องสมุดจริงๆ 
              ซึ่งจะเข้ากับหน้า Welcome และ Login ที่เราทำมาก่อนหน้านี้ที่สุด
              {"\n\n"}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              {"\n\n"}
              (เนื้อหาหน้าที่ 1/100)
            </Text>
          </ScrollView>

          {/* Bottom Control - ดีไซน์แบบลอย (Floating) */}
          <View style={styles.bottomControl}>
            <TouchableOpacity style={styles.navIcon}><Text style={styles.navIconText}>◀</Text></TouchableOpacity>
            <View style={styles.pageIndicatorContainer}>
              <Text style={styles.pageIndicatorText}>1 / 100</Text>
              <View style={styles.progressBar}><View style={styles.progressFill} /></View>
            </View>
            <TouchableOpacity style={styles.navIcon}><Text style={styles.navIconText}>▶</Text></TouchableOpacity>
          </View>
          
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  darkOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.82)' }, // ปรับให้เข้มเพื่อให้อ่านง่าย
  safeArea: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.2)'
  },
  closeBtn: { padding: 5 },
  closeBtnText: { color: '#fff', fontSize: 24 },
  titleContainer: { width: '60%' },
  headerTitle: { color: '#ccc', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  settingsBtn: { padding: 5 },
  settingsText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  readArea: { padding: 25, paddingBottom: 100 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  textUnderline: { height: 3, width: 60, backgroundColor: '#D32F2F', marginBottom: 25 }, // เส้นสีแดงเอกลักษณ์ของแอปเรา
  bookContent: { 
    fontSize: 19, 
    lineHeight: 32, 
    color: '#E0E0E0', 
    textAlign: 'justify',
    letterSpacing: 0.5
  },
  bottomControl: { 
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(30,30,30,0.95)',
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  navIconText: { color: '#fff', fontSize: 20 },
  pageIndicatorContainer: { alignItems: 'center', flex: 1 },
  pageIndicatorText: { color: '#fff', fontSize: 12, marginBottom: 5 },
  progressBar: { width: 100, height: 3, backgroundColor: '#444', borderRadius: 2 },
  progressFill: { width: '10%', height: '100%', backgroundColor: '#D32F2F', borderRadius: 2 },
});

export default Reader;