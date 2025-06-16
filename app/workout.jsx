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
import useWorkoutData from '../hooks/useWorkoutData';
import useTimer from '../hooks/useTimer';
import useAudio from '../hooks/useAudio';

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
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ALL HOOKS MUST BE CALLED FIRST - NO EXCEPTIONS
  const { incrementTimeSpent } = useTimeSpent("timeSpent");
  const { lastExercise, storeLastExercise } = useLastExercise();
  const { workoutData, exercises, weights, loading, updateWeight } = useWorkoutData(id);
  const { playSound } = useAudio(require('../assets/countdown.wav'));
  
  // Local state - ALL useState calls together
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [focusedInputIndex, setFocusedInputIndex] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Timer hook - using default values to prevent conditional calls
  const { timer, isTimerActive, toggleTimer } = useTimer(
    30, 
    null, 
    incrementTimeSpent, 
    playSound
  );

  // useEffect - always called
  useEffect(() => {
    console.log('Workout screen opened! Calling incrementWorkoutCount()');
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
          <Text>No exercises found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Safe to access exercises now since we've checked above
  const currentExercise = exercises[currentExerciseIndex] || {};
  const currentVideoUri = currentExercise.exercise?.videoUrl || '';
  const visibleExercises = exercises.slice(currentExerciseIndex, currentExerciseIndex + VISIBLE_COUNT);

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
      playSound();
    }
  };

  const handleDone = () => {
    const currentExercise = exercises[currentExerciseIndex];
    
    storeLastExercise(currentExercise.exercise);

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

  const handleWeightChange = (index, value) => {
    updateWeight(index, value);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <VideoPlayer videoUri={currentVideoUri} />

        <ExerciseHeader
          exerciseName={currentExercise.exercise?.name}
          description={currentExercise.exercise?.description}
          isDescriptionExpanded={isDescriptionExpanded}
          onToggleDescription={toggleDescription}
          timer={timer}
          isTimerActive={isTimerActive}
          onToggleTimer={toggleTimer}
        />

        <SectionHighlight title="Ushtrimet e dites" />

        <ExerciseList
          exercises={visibleExercises}
          weights={weights}
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