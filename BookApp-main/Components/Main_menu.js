import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg'};

const Main_menu = ({ navigation }) => {
  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}><Text style={styles.headerTitle}>Main Menu</Text></View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>My Book</Text>
          
          <View style={styles.grid}>
            {/* Card หนังสือที่ 1 */}
            <TouchableOpacity 
              style={styles.bookCard} 
              onPress={() => navigation.navigate('Book_Decs', { 
                title: "Morning Glory Flowers", 
                image: 'https://via.placeholder.com/150' 
              })}
            >
              <Image source={{uri: 'https://via.placeholder.com/150'}} style={styles.bookImage} />
              <Text style={styles.bookText} numberOfLines={2}>Morning Glory Flowers</Text>
            </TouchableOpacity>

            {/* Card หนังสือที่ 2 */}
            <TouchableOpacity 
              style={styles.bookCard}
              onPress={() => navigation.navigate('Book_Decs', { 
                title: "The Origin of Tenjin", 
                image: 'https://via.placeholder.com/150' 
              })}
            >
              <Image source={{uri: 'https://via.placeholder.com/150'}} style={styles.bookImage} />
              <Text style={styles.bookText} numberOfLines={2}>The Origin of Tenjin</Text>
            </TouchableOpacity>
          </View>
        
        </ScrollView>

        {/* Search Bar ลอยด้านบน Bottom Nav */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="ค้นหา" />
        </View>

        {/* Bottom Navigation Placeholder */}
        {/* <View style={styles.bottomNav}>
           <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>Main</Text></TouchableOpacity>
           <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ScanQR')}><Text style={styles.navText}>Add</Text></TouchableOpacity>
           <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>Profile</Text></TouchableOpacity>
        </View> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' },
  header: { backgroundColor: '#000', padding: 15, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18 },
  scrollContent: { padding: 20 },
  title: { fontSize: 40, fontWeight: 'bold', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  bookCard: { width: '48%', backgroundColor: '#fff', marginBottom: 15, padding: 5 },
  bookImage: { width: '100%', height: 150 },
  bookText: { fontSize: 12, marginTop: 5 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 10 },
  searchInput: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#000', height: 60, alignItems: 'center' },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#fff' }
});

export default Main_menu;