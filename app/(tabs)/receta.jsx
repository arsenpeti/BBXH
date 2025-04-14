import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from 'expo-router';
import { getWorkoutCount } from '../workoutStorage';
import useLastExercise from '../useLastExercise'; // Import the custom hook

const ProfileScreen = () => {
  const [userName, setUserName] = useState('');
  const [totalTime, setTotalTime] = useState(0);
  const [workoutCount, setWorkoutCount] = useState(0);
  const { lastExercise } = useLastExercise(); // Get the last completed exercise
  const safeLastExercise = lastExercise || { name: '', description: '' };

  // Fetch workout count when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchWorkoutCount = async () => {
        console.log('Fetching workout count...'); // Debugging log
        const count = await getWorkoutCount();
        console.log('Workout count set to:', count); // Debugging log
        setWorkoutCount(count);
      };
      fetchWorkoutCount();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchTime = async () => {
        try {
          const storedTime = await AsyncStorage.getItem('timeSpent');
          const totalSeconds = storedTime ? parseInt(storedTime, 10) : 0;
          console.log('Retrieved Time Spent in minutes:', totalSeconds);
          setTotalTime(Math.floor(totalSeconds / 60)); // Update the total time state
        } catch (error) {
          console.error('Error retrieving time spent:', error);
        }
      };
      fetchTime();
    }, [])
  );

  // Fetch user name from AsyncStorage when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchUserName = async () => {
        try {
          // Get the user name that was saved in the home component
          const storedUserName = await AsyncStorage.getItem('userName');
          if (storedUserName) {
            console.log('Retrieved user name from AsyncStorage:', storedUserName);
            setUserName(storedUserName);
          } else {
            console.log('No user name found in AsyncStorage, setting default name');
            // If no name is found in AsyncStorage, set a default name
            await AsyncStorage.setItem('userName', 'User');
            setUserName('User'); // Use a default name instead of 'Guest'
          }
        } catch (error) {
          console.error('Error retrieving user name:', error);
          // In case of error, set a default name
          await AsyncStorage.setItem('userName', 'User');
          setUserName('User'); // Use a default name instead of 'Guest'
        }
      };

      fetchUserName();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['#ffd9e5', '#E84479']}
        start={[0, 0]}
        end={[0, 1]}
        locations={[0, 1]}
        style={styles.header}
      >
        <Text style={styles.username}>{userName}</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Animatable.View animation="rotate" duration={2000} iterationCount={1}>
            <FontAwesome5 name="dumbbell" size={24} color="#FF1493" />
          </Animatable.View>
          <Text style={styles.statValue}>{workoutCount}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>

        <View style={styles.statBox}>
          <Animatable.View animation="rotate" duration={2000} iterationCount={1}>
            <FontAwesome5 name="clock" size={24} color="#FF1493" />
          </Animatable.View>
          <Text style={styles.statValue}>{totalTime}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
      </View>

      <View style={[styles.statsContainer, { marginTop: 40 }]}>
        <View style={styles.statBoxRow}>
          <Animatable.View animation="rotate" duration={2000} iterationCount={1}>
            <FontAwesome5 name="calendar-check" size={28} color="#FF1493" style={styles.iconLeft} />
          </Animatable.View>
          <View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
        </View>
      </View>

      <View style={[styles.statsContainer, { marginTop: 40 }]}>
        <View style={styles.statBoxRow}>
          <Animatable.View animation="rotate" duration={2000} iterationCount={1}>
            <FontAwesome5 name="history" size={28} color="#FF1493" style={styles.iconLeft} />
          </Animatable.View>
          <View>
            <Text style={styles.statValue}>Recent Activities</Text>
            {safeLastExercise.name ? (
              <View>
                <Text style={styles.lastExerciseText}>Last Completed Exercise: {safeLastExercise.name}</Text>
                <Text style={styles.exerciseDescription}>{safeLastExercise.description}</Text>
              </View>
            ) : (
              <Text style={styles.noExerciseText}>No recent activities found.</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    paddingBottom: 60,
  },
  header: {
    width: '100%',
    paddingVertical: 100,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 40,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  statBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
  },
  iconLeft: {
    marginRight: 15,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  lastExerciseText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  noExerciseText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
