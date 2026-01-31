import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg' };

const Main_menu = ({ navigation }) => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
const SEARCH_API = "http://192.168.0.254:3000/api/books/search";
const MY_BOOKS_API = "http://192.168.0.254:3000/api/books/my-books";

  // ฟังก์ชันค้นหาหนังสือ
  const searchBooks = async (Text) => {
    setQuery(Text);
    if (Text.length === 0) {
      // ถ้าไม่มี query ให้เรียกหนังสือของผู้ใช้
      fetchMyBooks();
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${SEARCH_API}/${Text}`, { credentials: 'include' });
      const data = await res.json();
      console.log("Search results:", data);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ดึงหนังสือของผู้ใช้ที่ login
  const fetchMyBooks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(MY_BOOKS_API, { credentials: 'include' });
      if (!res.ok) {
        console.warn('Failed fetching my-books:', res.status);
        setResults([]);
        return;
      }
      const data = await res.json();
      console.log('My books:', data);
      setResults(data);
    } catch (err) {
      console.error('Fetch my-books error:', err);
      setResults([]);
    }
    finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMyBooks();
  }, []);
  return (
    <ImageBackground source={bgImage} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.header}><Text style={styles.headerTitle}>Main Menu</Text></View>

        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            // ถ้าเรียกจาก /my-books จะได้เอกสาร BookCodes และ populated bookId
            const book = item.bookId || item;
            const image = book.coverImage ? book.coverImage.url : 'https://via.placeholder.com/150';
            return (
              <TouchableOpacity
                style={styles.bookCard}
                onPress={() => navigation.navigate('Book_Decs', {
                  title: book.title,
                  image,
                  bookId: book._id
                })}
              >
                <Image source={{ uri: image }} style={styles.bookImage} />
                <Text style={styles.bookText} numberOfLines={2}>{book.title}</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <Text style={styles.emptyText}>คุณยังไม่มีหนังสือ</Text>
              )}
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>My Book</Text>
            </View>
          }
          contentContainerStyle={styles.scrollContent}
        />

        {/* Search Bar ลอยด้านบน Bottom Nav */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="ค้นหา" value={query} onChangeText={searchBooks} />
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
  ,
  emptyText: { fontSize: 16, color: '#333' }
});

export default Main_menu;