import React, { useState, useEffect } from 'react';
import { View, Image, Text, Alert, SafeAreaView, Dimensions } from 'react-native';
import axios from 'axios';
import GestureRecognizer from 'react-native-swipe-gestures';

const { width, height } = Dimensions.get('window');

const Home = ({ token }) => {
  const [book, setBook] = useState(null);

  const analyzeInterests = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', {
        token: token,
      });
      const inferredInterests = res.data.inferredInterests;
      Alert.alert('Inferred Interests', `Based on your likes, your interests are: ${inferredInterests}`);
      
      fetchBook(inferredInterests);
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchBook = async (interests = 'the') => {
    try {
      const res = await axios.get(`https://openlibrary.org/search.json?q=${interests}`);
      const randomBook = res.data.docs[Math.floor(Math.random() * res.data.docs.length)];
      const coverURL = `https://covers.openlibrary.org/b/id/${randomBook.cover_i}-L.jpg`;
  
      setBook({ ...randomBook, coverURL });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBook(); 
  }, []);

  const handleSwipeRight = async () => {
    try {
      await axios.post('http://localhost:5000/api/books/like', {
        token: token,
        book: book,   
      });
      Alert.alert('Liked!', `${book.title} has been added to your liked books.`);
      fetchBook(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwipeLeft = () => {
    Alert.alert('Disliked!', `${book.title} has been skipped.`);
    fetchBook();
  };

  if (!book) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <GestureRecognizer
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        config={{ velocityThreshold: 0.3, directionalOffsetThreshold: 80 }}
        style={styles.gestureContainer}
      >
        <View style={styles.contentContainer}>
          {book.coverURL ? (
            <Image source={{ uri: book.coverURL }} style={styles.bookCover} resizeMode="contain" />
          ) : (
            <View style={styles.noCoverContainer}>
              <Text>No cover available</Text>
            </View>
          )}
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>{book.author_name ? book.author_name[0] : 'Unknown Author'}</Text>
        </View>
      </GestureRecognizer>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gestureContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bookCover: {
    width: width * 0.8,
    height: height * 0.6,
    marginBottom: 20,
  },
  noCoverContainer: {
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  bookAuthor: {
    fontSize: 18,
    textAlign: 'center',
  },
};

export default Home;