import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const LikedBooks = ({ token }) => {
  const [likedBooks, setLikedBooks] = useState([]);

  const fetchLikedBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/likedBooks', {
        headers: { 'x-auth-token': token },
      });
      setLikedBooks(res.data.likedBooks);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load liked books');
    }
  };

  useEffect(() => {
    fetchLikedBooks();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {likedBooks.map((book, index) => (
        <View key={index} style={styles.bookContainer}>
          <Image source={{ uri: book.coverURL }} style={styles.bookCover} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  bookContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  bookCover: {
    width: 150,
    height: 220,
  },
});

export default LikedBooks;
