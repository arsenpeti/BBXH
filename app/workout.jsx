import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';

// Import custom hooks
import useTimeSpent from './withTimeSpent';
import { incrementWorkoutCount } from './workoutStorage';
import useLastExercise from '../app/useLastExercise';
import programsApi from '../api/programsApi';
import useTimer from '../hooks/useTimer';
import useAudio from '../hooks/useAudio';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import components
import VideoPlayer from '../components/VideoPlayer';
import ExerciseHeader from '../components/ExerciseHeader';
import SectionHighlight from '../components/SectionHighlight';
import ExerciseList from '../components/ExerciseList';
import ActionButton from '../components/ActionButton';

const VISIBLE_COUNT = 4;
const { width, height } = Dimensions.get('window');

// Loading Component
const WorkoutLoadingScreen = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <Animated.Text
        style={[
          styles.loadingTitle,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        Bodies By Xhes
      </Animated.Text>
    </View>
  );
};

const WorkoutView = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const router = useRouter();

  // ALL HOOKS MUST BE CALLED FIRST - NO EXCEPTIONS
  const { incrementTimeSpent } = useTimeSpent("timeSpent");
  const { lastExercise, storeLastExercise } = useLastExercise();
  const { playSound } = useAudio(require('../assets/countdown.wav'));
  
  // Local state - ALL useState calls together
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [focusedInputIndex, setFocusedInputIndex] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exerciseWeights, setExerciseWeights] = useState({});

  // Timer hook - using default values to prevent conditional calls
  const { timer, isTimerActive, toggleTimer } = useTimer(
    30, 
    null, 
    incrementTimeSpent, 
    playSound
  );

  // Timeout ref for debounced saving
  const saveTimeoutRef = useRef(null);

  // Helper function to get storage key
  const getStorageKey = () => `exerciseWeights_${id}_v2`;

  // Helper function to get consistent exercise ID
  const getExerciseId = (exercise, index) => {
    return exercise.exerciseId || 
           exercise.id || 
           `exercise_${exercise.name || exercise.exercise || index}`;
  };

  // Process exercises from program data
  const processExercises = (programData) => {
    let exercises = [];
    
    if (programData) {
      console.log('Processing program data:', programData);
      
      // Check if program has weeks structure
      if (programData.weeks && Array.isArray(programData.weeks)) {
        exercises = programData.weeks.flatMap(week => 
          week.workouts ? week.workouts.flatMap((workout, workoutIndex) =>
            workout.exercises ? workout.exercises.map((ex, exerciseIndex) => ({
              ...ex,
              exerciseId: ex.id || ex.exerciseId || `week_${week.id || 'w'}_workout_${workoutIndex}_exercise_${exerciseIndex}`,
              workoutName: workout.name || 'Workout',
              workoutDescription: workout.description || '',
              videoUrl: ex.videoUrl || ex.video_url || '',
              name: ex.name || ex.exercise || 'Exercise'
            })) : []
          ) : []
        );
      }
      // Check if program has workouts directly
      else if (programData.workouts && Array.isArray(programData.workouts)) {
        exercises = programData.workouts.flatMap((workout, workoutIndex) =>
          workout.exercises ? workout.exercises.map((ex, exerciseIndex) => ({
            ...ex,
            exerciseId: ex.id || ex.exerciseId || `workout_${workoutIndex}_exercise_${exerciseIndex}`,
            workoutName: workout.name || 'Workout',
            workoutDescription: workout.description || '',
            videoUrl: ex.videoUrl || ex.video_url || '',
            name: ex.name || ex.exercise || 'Exercise'
          })) : []
        );
      }
      // Check if program has exercises directly
      else if (programData.exercises && Array.isArray(programData.exercises)) {
        exercises = programData.exercises.map((ex, index) => ({
          ...ex,
          exerciseId: ex.id || ex.exerciseId || `program_${id}_exercise_${index}`,
          workoutName: programData.name || 'Program',
          workoutDescription: programData.description || '',
          videoUrl: ex.videoUrl || ex.video_url || '',
          name: ex.name || ex.exercise || 'Exercise'
        }));
      }
      // If none of the above, create a default exercise structure
      else {
        console.log('Creating default exercise from program data');
        exercises = [{
          id: programData.id || '1',
          exerciseId: `program_${id}_exercise_0`,
          name: programData.name || 'Program Exercise',
          description: programData.description || 'Complete this program',
          workoutName: programData.name || 'Program',
          workoutDescription: programData.description || '',
          videoUrl: programData.imageUrl || '',
          sets: 3,
          reps: 10,
          weight: 0
        }];
      }
    }
    
    return exercises;
  };

  // Process exercises
  const exercises = processExercises(programData);

  console.log('Final exercises array:', exercises);

  // Fetch program data from API on mount
  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      try {
        console.log('Fetching program with ID:', id);
        const data = await programsApi.getProgramById(id);
        console.log('Received program data from API:', JSON.stringify(data, null, 2));
        setProgramData(data);
      } catch (error) {
        console.error('Error fetching program:', error);
        setProgramData(null);
      }
      setLoading(false);
    };
    
    if (id) {
      fetchProgram();
    }
  }, [id]);

  // Load saved weights when component mounts
  useEffect(() => {
    const loadSavedWeights = async () => {
      try {
        const storageKey = getStorageKey();
        const savedWeights = await AsyncStorage.getItem(storageKey);
        
        if (savedWeights) {
          const parsedWeights = JSON.parse(savedWeights);
          console.log('Loaded saved weights:', parsedWeights);
          setExerciseWeights(parsedWeights);
        } else {
          console.log('No saved weights found');
        }
      } catch (error) {
        console.error('Error loading saved weights:', error);
      }
    };
    
    if (id) {
      loadSavedWeights();
    }
  }, [id]);

  // Save weights with debouncing whenever exerciseWeights changes
  useEffect(() => {
    const saveWeights = async () => {
      try {
        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        // Debounce saving to avoid too frequent writes
        saveTimeoutRef.current = setTimeout(async () => {
          // Convert string values to numbers for storage, but keep empty strings as 0
          const weightsToSave = {};
          Object.keys(exerciseWeights).forEach(key => {
            const value = exerciseWeights[key];
            weightsToSave[key] = value === '' ? 0 : (parseFloat(value) || 0);
          });
          
          const storageKey = getStorageKey();
          await AsyncStorage.setItem(storageKey, JSON.stringify(weightsToSave));
          console.log('Weights saved:', weightsToSave);
        }, 500); // Wait 500ms after last change
        
      } catch (error) {
        console.error('Error saving weights:', error);
      }
    };
    
    if (Object.keys(exerciseWeights).length > 0) {
      saveWeights();
    }

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [exerciseWeights]);

  // Increment workout count
  useEffect(() => {
    incrementWorkoutCount();
  }, []);

  // NOW we can do conditional rendering - all hooks are called above
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <WorkoutLoadingScreen />
      </SafeAreaView>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.errorText}>No exercises found for this program</Text>
          <Text style={styles.debugText}>Program ID: {id}</Text>
          <Text style={styles.debugText}>Program Data: {programData ? 'Available' : 'Not Available'}</Text>
          {programData && (
            <Text style={styles.debugText}>
              Data Keys: {Object.keys(programData).join(', ')}
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Safe to access exercises now since we've checked above
  const currentExercise = exercises[currentExerciseIndex] || {};
  const currentVideoUri = currentExercise.videoUrl || '';
  const visibleExercises = exercises.slice(currentExerciseIndex, currentExerciseIndex + VISIBLE_COUNT);

  // Improved handleWeightChange function
  const handleWeightChange = (exerciseId, value) => {
    // Allow empty string, only convert to number when saving or displaying
    // This allows users to delete all text and start fresh
    setExerciseWeights(prev => ({
      ...prev,
      [exerciseId]: value // Store the actual string value
    }));
    
    console.log(`Weight updated for ${exerciseId}: ${value}`);
  };

  // Create weights array with saved values
  const getWeightsArray = () => {
    return exercises.map((exercise, index) => {
      const exerciseId = getExerciseId(exercise, index);
      const savedWeight = exerciseWeights[exerciseId];
      
      // If we have a saved weight, use it (could be string or number)
      if (savedWeight !== undefined && savedWeight !== null) {
        return {
          exerciseId,
          weight: savedWeight.toString() // Convert to string for input display
        };
      }
      
      // Fallback to exercise default weight
      return {
        exerciseId,
        weight: (exercise.weight || 0).toString()
      };
    });
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
      playSound();
    }
  };

  const handleDone = () => {
    const currentExercise = exercises[currentExerciseIndex];
    
    storeLastExercise(currentExercise.name || currentExercise.exercise || 'Exercise');

    if (currentExerciseIndex === exercises.length - 1) {
      router.push('/home');
    } else {
      setCompletedExercises(prev => [...prev, currentExerciseIndex]);
      setCurrentExerciseIndex(prevIndex => prevIndex + 1);
    }
  };

  const goToNextVideo = () => {
    if (currentVideoIndex < exercises.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const handleInputFocus = (index) => {
    setFocusedInputIndex(index);
  };

  const handleInputBlur = () => {
    setFocusedInputIndex(null);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleActionButton = () => {
    goToNextVideo();
    handleDone();
  };

  // Debug function (can be called from console if needed)
  const debugWeights = () => {
    console.log('Current exerciseWeights state:', exerciseWeights);
    console.log('Exercises with IDs:', exercises.map(ex => ({ 
      name: ex.name, 
      exerciseId: getExerciseId(ex, exercises.indexOf(ex))
    })));
    console.log('Weights array:', getWeightsArray());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <VideoPlayer videoUri={currentVideoUri} />

        <ExerciseHeader
          exerciseName={currentExercise.name || currentExercise.exercise || 'Exercise'}
          description={currentExercise.description || currentExercise.workoutDescription || ''}
          isDescriptionExpanded={isDescriptionExpanded}
          onToggleDescription={toggleDescription}
          timer={timer}
          isTimerActive={isTimerActive}
          onToggleTimer={toggleTimer}
        />

        <SectionHighlight title="Ushtrimet e dites" />

        <ExerciseList
          exercises={visibleExercises}
          weights={getWeightsArray()}
          focusedInputIndex={focusedInputIndex}
          currentExerciseIndex={currentExerciseIndex}
          onWeightChange={handleWeightChange}
          onInputFocus={handleInputFocus}
          onInputBlur={handleInputBlur}
        />
      </View>

      <ActionButton
        title={currentExerciseIndex === exercises.length - 1 ? 'Done' : 'Next'}
        onPress={handleActionButton}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
  },
  loadingTitle: {
    fontSize: 32,
    fontFamily: 'Playfair Display',
    color: '#E84479',
    textAlign: 'center',
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 18,
    color: '#E84479',
    textAlign: 'center',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingEmoji: {
    position: 'absolute',
    fontSize: 24,
    opacity: 0.6,
  },
});

export default WorkoutView;