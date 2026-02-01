import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';

const bgImage = {
  uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg'
};

const Main_menu = ({ navigation }) => {

  // ✅ Hook ต้องอยู่ตรงนี้เท่านั้น
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/api/my-books', {
        credentials: 'include',
      });

      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.log('FETCH BOOK ERROR:', err);
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Main Menu</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>My Book</Text>

          <View style={styles.searchContainer}>
            <TextInput style={styles.searchInput} placeholder="ค้นหา" />
          </View>

          <View style={styles.grid}>
            {books.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>คุณยังไม่มีหนังสือ</Text>

                <TouchableOpacity onPress={() => navigation.navigate('Add')}>
                  <Text style={styles.emptyAction}>
                    กดเพื่อเพิ่มหนังสือเล่มแรกของคุณ
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              books.map((book) => (
                <TouchableOpacity
                  key={book._id}
                  style={styles.bookCard}
                  onPress={() =>
                    navigation.navigate('Book_Decs', {
                      title: book.bookTitle,
                    })
                  }
                >
                  <Image
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    style={styles.bookImage}
                  />
                  <Text style={styles.bookText} numberOfLines={2}>
                    {book.bookTitle}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

        </ScrollView>
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
  navText: { color: '#fff' },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },

  emptyText: {
    fontSize: 18,
    color: '#555',
  },

  emptyAction: {
    color: '#D32F2F',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Main_menu;