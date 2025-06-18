import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../api/baseUrl';

const App = () => {
  const [items, setItems] = useState([1, 2, 3, 4]); // Days list
  const [currentDay, setCurrentDay] = useState(1); // Track the current unlocked day
  const [isHome, setIsHome] = useState(true);
  const [programData, setProgramData] = useState(null); // Store the program data
  const [loading, setLoading] = useState(true); // Track loading state
  const [errorMessage, setErrorMessage] = useState(null); // Track error message
  const router = useRouter();

  const handlePress = () => {
    if (isHome) {
      setIsHome(false);
      setItems([5, 6, 7, 8]); // Update to another set of items for the dumbbell icon
    } else {
      setIsHome(true);
      setItems([1, 2, 3, 4]); // Reset back to the original set of items
    }
  };

  // Fetch program data from the API
  useEffect(() => {
    console.log('Home screen mounted - Fetching all programs...'); // Updated log message
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        console.log('Auth Token:', token); // Log the token
        
        if (!token) {
          console.error('No auth token found');
          setErrorMessage('Authentication required. Please login again.');
          return;
        }
        
        // Fetch all programs
        console.log('Making API call to:', `${BASE_URL}/programs`);
        const response = await axios.get(`${BASE_URL}/programs`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', JSON.stringify(response.data, null, 2)); // Log the full response

        // Transform the programs data to match the expected format
        const transformedData = {
          program: { name: 'User' },
          weeks: response.data.map((program, index) => ({
            order: index,
            name: program.name,
            description: program.description,
            price: program.price,
            isPublic: program.isPublic,
            createdAt: program.createdAt,
            updatedAt: program.updatedAt,
            workouts: [{
              id: program.id,
              imageUrl: program.imageUrl || 'https://via.placeholder.com/150'
            }]
          }))
        };

        console.log('Transformed Data:', JSON.stringify(transformedData, null, 2)); // Log the transformed data

        setProgramData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message); // Log detailed error
        setErrorMessage('Failed to load programs. Please try again.');
        // Set default data in case of error
        setProgramData({
          program: { name: 'User' },
          weeks: [
            {
              order: 0,
              name: 'Week 1',
              workouts: [{ id: '1', imageUrl: 'https://via.placeholder.com/150' }]
            }
          ]
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once when component mounts

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Render the fetched program data
  const program = programData?.program;
  const weeks = programData?.weeks || [];

  return (
    <>
      <SafeAreaView style={styles.ara}>
        {/* Header outside SafeAreaView */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Mirmengjesi {program?.name}</Text>
          </View>
          <View style={styles.headerContent}>
            {/* Horizontal ScrollView */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              style={styles.scrollView}
            >
              {Array.from({ length: 15 }, (_, index) => {
                const day = index + 1;
                return (
                  <View key={index} style={styles.circle}>
                    <Text style={styles.circleText}>{day}</Text>
                    {day > currentDay && (
                      <MaterialIcons
                        name="lock"
                        size={16}
                        color="#fff"
                        style={styles.lockIcon}
                      />
                    )}
                  </View>
                );
              })}
            </ScrollView>
            {/* Home / Dumbbell Icon */}
            <View style={styles.iconWrapper}>
              <TouchableOpacity onPress={handlePress}>
                {isHome ? (
                  <MaterialIcons name="home" size={30} color="white" />
                ) : (
                  <FontAwesome5 name="dumbbell" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* SafeAreaView for remaining content */}
      <SafeAreaView style={styles.safeArea}>
        {/* ScrollView for containers */}
        <ScrollView
          contentContainerStyle={styles.scrollViewContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {weeks.map((week, index) => (
            <TouchableOpacity
              key={index}
              style={styles.containerBox}
              onPress={() => {
                const programId = week.workouts[0].id;
                router.push({
                  pathname: '/workout',
                  params: { id: programId },
                });
              }}
            >
              <Image
                source={{ uri: week?.workouts[0]?.imageUrl || 'https://via.placeholder.com/150' }}
                style={styles.image}
              />
              <View style={styles.textSection}>
                <Text style={styles.weekText}>{week.name}</Text>
                <Text style={styles.containerText}>{week.description || `Program ${index + 1}`}</Text>
                <View style={styles.timerSection}>
                  <FontAwesome5 name="clock" size={14} color="#999" />
                  <Text style={styles.timerText}>{week.duration || '30'} seconds</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  ara: {
    paddingBottom: -50,
    backgroundColor: '#EF87AA',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  /* Header styles */
  header: {
    backgroundColor: '#EF87AA',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Added margin to create space between the text and ScrollView
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 0,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#E84479',
    position: 'relative', // Needed to position the lock icon inside the circle
  },
  circleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  lockIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E84479',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  /* ScrollView content styles */
  scrollViewContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flexGrow: 1,
  },
  /* Container styles */
  containerBox: {
    width: '90%',
    maxWidth: 337,
    height: 210,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 120,
  },
  textSection: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  weekText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'left',
    marginBottom: 5,
  },
  containerText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timerText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    color: '#000',
  },
});

export default App;
