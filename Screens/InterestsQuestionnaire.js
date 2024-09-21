import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const InterestsQuestionnaire = ({ route }) => {
  const { token } = route.params;
  const navigation = useNavigation();

  const [genres, setGenres] = useState([]);
  const [readingLevel, setReadingLevel] = useState('');
  const [settings, setSettings] = useState([]);
  const [bookLength, setBookLength] = useState([]);
  const [readingPurpose, setReadingPurpose] = useState([]);

  const genreOptions = ['Healthcare', 'Finance', 'Tech', 'Entrepreneurship', 'Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Thriller', 'Fantasy Fiction', 'Biography', 'Autobiography', 'Horror', 'Poetry', "Children's Books"];
  const readingLevelOptions = ['Beginner', 'Intermediate', 'Pro'];
  const settingOptions = ['Utopia', 'Dystopia', 'Historical', 'Modern-Day'];
  const bookLengthOptions = ['< 100 pages', '100 - 200 pages', '200 - 300 pages', '> 300 pages'];
  const readingPurposeOptions = ['Thought-provoking', 'Action-packed', 'Educational', 'Relaxing'];

  const toggleSelection = (option, state, setState) => {
    if (state.includes(option)) {
      setState(state.filter(item => item !== option));
    } else {
      setState([...state, option]);
    }
  };

  const submitPreferences = async () => {
    try {
      await axios.post('http://localhost:5000/api/user/preferences', {
        token,
        preferences: {
          genres,
          readingLevel,
          settings,
          bookLength,
          readingPurpose
        }
      });
      navigation.navigate('Home', { token });
    } catch (error) {
        const errorMessage = error.response?.data?.msg || 'An error occurred during preferences';
        Alert.alert('Error', errorMessage);
        console.error('Preferences error:', error);
    }
  };

  const renderOptions = (options, state, setState, multiple = true) => {
    return options.map(option => (
      <TouchableOpacity
        key={option}
        style={[
          styles.option,
          multiple
            ? state.includes(option) && styles.selectedOption
            : state === option && styles.selectedOption
        ]}
        onPress={() => multiple ? toggleSelection(option, state, setState) : setState(option)}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tell us about your reading preferences</Text>
      
      <Text style={styles.sectionTitle}>Genres (Select multiple)</Text>
      <View style={styles.optionsContainer}>
        {renderOptions(genreOptions, genres, setGenres)}
      </View>

      <Text style={styles.sectionTitle}>Level of Reading</Text>
      <View style={styles.optionsContainer}>
        {renderOptions(readingLevelOptions, readingLevel, setReadingLevel, false)}
      </View>

      <Text style={styles.sectionTitle}>Preferred Setting and Style (Select multiple)</Text>
      <View style={styles.optionsContainer}>
        {renderOptions(settingOptions, settings, setSettings)}
      </View>

      <Text style={styles.sectionTitle}>Desired Book Length (Select multiple)</Text>
      <View style={styles.optionsContainer}>
        {renderOptions(bookLengthOptions, bookLength, setBookLength)}
      </View>

      <Text style={styles.sectionTitle}>Reading Purpose (Select multiple)</Text>
      <View style={styles.optionsContainer}>
        {renderOptions(readingPurposeOptions, readingPurpose, setReadingPurpose)}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={submitPreferences}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E7EAF2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  option: {
    backgroundColor: '#C76D7E',
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  selectedOption: {
    backgroundColor: '#9B4B58',
  },
  optionText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#C76D7E',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InterestsQuestionnaire;