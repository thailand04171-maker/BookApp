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
  const [searchText, setSearchText] = useState('');
  // ✅ Hook ต้องอยู่ตรงนี้เท่านั้น
  const [books, setBooks] = useState([]);

  const filteredBooks = books.filter(book =>
    book.bookTitle
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const res = await fetch('https://bookapp-h41h.onrender.com/api/my-books', {
        credentials: 'include',
      });

      const data = await res.json();
      console.log("My Books Data:", JSON.stringify(data, null, 2)); // 🔥 เช็คข้อมูลที่ได้จาก API ใน Terminal
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks([]);
      }
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
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาหนังสือ"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View style={styles.grid}>
            {filteredBooks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>คุณยังไม่มีหนังสือ</Text>

                <TouchableOpacity onPress={() => navigation.navigate('Add')}>
                  <Text style={styles.emptyAction}>
                    กดเพื่อเพิ่มหนังสือเล่มแรกของคุณ
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredBooks.map((book) => {
                // 🔥 ตรวจสอบว่ามี URL และเป็น http หรือไม่ (ป้องกัน path แบบ relative เช่น /images/...)
                const rawUrl = book.bookId?.coverImage?.url;
                const imageUrl = (rawUrl && rawUrl.startsWith('http')) 
                  ? rawUrl 
                  : 'https://via.placeholder.com/150';

                return (
                  <TouchableOpacity
                    key={book._id}
                    style={styles.bookCard}
                    onPress={() =>
                      navigation.navigate('Book_Decs', {
                        title: book.bookTitle,
                        image: imageUrl, 
                        description: book.bookId?.description || "ไม่มีรายละเอียด",
                        pdfUrl: book.bookId?.pdf?.secure_url || book.bookId?.pdf?.url, // 🔥 ใช้ secure_url สำหรับ Cloudinary Raw (HTTPS)
                      })
                    }
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.bookImage}
                    />
                    <Text style={styles.bookText} numberOfLines={2}>
                      {book.bookTitle}
                    </Text>
                  </TouchableOpacity>
                );
              })
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