import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';

// Replace with your actual background image from assets
const bgImage = { uri: 'https://w0.peakpx.com/wallpaper/717/357/HD-wallpaper-books-phone-library.jpg'};

const Welcome = ({ navigation }) => {
  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      {/* Dark overlay to match the design's mood and improve text contrast */}
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>LIBRARY</Text>
            <Text style={styles.subtitle}>
              There is no problem that a{"\n"}library can't solve
            </Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Login')} // Triggers transition to Login.js
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>LET'S Go  →</Text>
            </TouchableOpacity>
          </View>

          {/* Home indicator styling for a clean finish */}
          <View style={styles.footerIndicator} />
          
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Adjust opacity to match your Figma design
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#D32F2F', // The vibrant red from your design
    width: '100%',
    height: 55,
    borderRadius: 12, // Match the rounded corners in your Figma
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footerIndicator: {
    height: 5,
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    opacity: 0.5,
  }
});

export default Welcome;