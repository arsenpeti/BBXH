import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../api/baseUrl';
import programsApi from '../../api/programsApi';

// Beautiful Program Loading Component
const ProgramLoadingScreen = () => {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim1 = useRef(new Animated.Value(0.3)).current;
  const fadeAnim2 = useRef(new Animated.Value(0.3)).current;
  const fadeAnim3 = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // Dots animation
    const dotsAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim1, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim2, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim3, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotation animation for dumbbell
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Start all animations
    pulseAnimation.start();
    dotsAnimation.start();
    rotationAnimation.start();

    // Cleanup
    return () => {
      pulseAnimation.stop();
      dotsAnimation.stop();
      rotationAnimation.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={loadingStyles.loadingContainer}>
      {/* Background circles */}
      <View style={loadingStyles.backgroundCircles}>
        <Animated.View 
          style={[
            loadingStyles.circle, 
            loadingStyles.circle1,
            { transform: [{ scale: pulseAnim }] }
          ]} 
        />
        <Animated.View 
          style={[
            loadingStyles.circle, 
            loadingStyles.circle2,
            { transform: [{ scale: pulseAnim }] }
          ]} 
        />
      </View>

      {/* Main content */}
      <Animated.View 
        style={[
          loadingStyles.mainContent,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        {/* Rotating dumbbell icon */}
        <Animated.View style={[loadingStyles.iconContainer, { transform: [{ rotate: spin }] }]}>
          <FontAwesome5 name="dumbbell" size={40} color="#E84479" />
        </Animated.View>

        {/* Loading text */}
        <Text style={loadingStyles.loadingText}>Preparing Program</Text>

        {/* Animated dots */}
        <View style={loadingStyles.dotsContainer}>
          <Animated.View style={[loadingStyles.dot, { opacity: fadeAnim1 }]} />
          <Animated.View style={[loadingStyles.dot, { opacity: fadeAnim2 }]} />
          <Animated.View style={[loadingStyles.dot, { opacity: fadeAnim3 }]} />
        </View>
      </Animated.View>

      {/* Bottom accent */}
      <View style={loadingStyles.bottomAccent}>
        <Text style={loadingStyles.accentText}>Bodies By Xhes</Text>
      </View>
    </View>
  );
};

const App = () => {
  const [items, setItems] = useState([1, 2, 3, 4]); // Days list
  const [currentDay, setCurrentDay] = useState(1); // Track the current unlocked day
  const [isHome, setIsHome] = useState(true);
  const [programData, setProgramData] = useState(null); // Store the program data
  const [loading, setLoading] = useState(true); // Track loading state
  const [errorMessage, setErrorMessage] = useState(null); // Track error message
  const [fetchingProgram, setFetchingProgram] = useState(false);
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
            id: program.id, // Store the original program ID here
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
              id: '1', // Add default ID
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

  // Function to handle program click
  const handleProgramPress = async (programId) => {
    try {
      setFetchingProgram(true);
      console.log('Fetching program details for ID:', programId); // Add logging
      
      // Fetch program details by id - this calls GET /api/programs/{id}
      const programDetails = await programsApi.getProgramById(programId);
      
      console.log('Program details fetched:', programDetails); // Add logging
      setFetchingProgram(false);
      
      // Navigate to workout screen, passing the program data
      router.push({
        pathname: '/workout',
        params: { 
          id: programId, 
          program: JSON.stringify(programDetails)
        },
      });
    } catch (error) {
      console.error('Error fetching program details:', error); // Add logging
      setFetchingProgram(false);
      setErrorMessage('Failed to load program details. Please try again.');
    }
  };

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
        {/* Show error message if any */}
        {errorMessage && (
          <View style={{ padding: 20, backgroundColor: '#ffebee' }}>
            <Text style={{ color: '#c62828' }}>{errorMessage}</Text>
          </View>
        )}
        
        {/* Beautiful loading screen when fetching a program */}
        {fetchingProgram && <ProgramLoadingScreen />}
        
        {/* ScrollView for containers */}
        {!fetchingProgram && (
          <ScrollView
            contentContainerStyle={styles.scrollViewContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {weeks.map((week, index) => (
              <TouchableOpacity
                key={index}
                style={styles.containerBox}
                onPress={() => handleProgramPress(week.id)} // Use week.id instead of week.workouts[0].id
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
        )}
      </SafeAreaView>
    </>
  );
};

// Loading component styles
const loadingStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    position: 'relative',
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(232, 68, 121, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
  },
  circle2: {
    width: 300,
    height: 300,
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#E84479',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#E84479',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E84479',
    marginHorizontal: 4,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  accentText: {
    fontSize: 16,
    color: '#E84479',
    fontWeight: '300',
    opacity: 0.7,
  },
});

// Main component styles
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