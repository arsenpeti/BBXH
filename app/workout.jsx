import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import useTimeSpent from './withTimeSpent';
import { incrementWorkoutCount } from './workoutStorage';


const { width } = Dimensions.get('window');
const IMG_HEIGHT = 235;
const VISIBLE_COUNT = 4;

const WorkoutView = () => {
  const { id } = useLocalSearchParams();
  const {incrementTimeSpent} = useTimeSpent("timeSpent"); // Use the hook to track time spent

  const [lineWidth, setLineWidth] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timer, setTimer] = useState(30);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [weights, setWeights] = useState([]); // State to hold weights
  const [focusedInputIndex, setFocusedInputIndex] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [sound, setSound] = useState(null);
  const router = useRouter();
  const [secondsSpent, setSecondsSpent] = useState(0); // State to hold seconds spent
  // Load sound once when the component mounts
  

  // Load the sound when the component mounts
  useEffect(() => {
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/countdown.wav') // Path to your sound file
        );
        setSound(sound); // Store the sound object
        await sound.replayAsync(); // Play the sound as soon as it's loaded
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    }

    loadSound(); // Call the function to load and play the sound

    // Cleanup when the component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync(); // Unload the sound to avoid memory leaks
      }
    };
  }, []); // This runs only once when the component is mounted

  
  useEffect(() => {
    console.log('Workout screen opened! Calling incrementWorkoutCount()'); // Debugging log
    incrementWorkoutCount();
  }, []);


  const fetchWorkoutData = async () => {
    const options = {
      method: 'GET',
      url: `https://stoplight.io/mocks/gym-app-ira/bodie-by-xhess/674100124/user/workouts/${id}`,
      headers: { Accept: 'application/json', Authorization: 'Bearer 123' },
    };

    try {
      const { data } = await axios.request(options);
    
      setWorkoutData(data.workout);
      setExercises(data.exercises);
  
      // Load saved weights
      loadWeights(data.exercises.length);
    } catch (error) {
      console.error('Error fetching workout data:', error);
    }
  };

  const loadWeights = async (exerciseCount) => {
    try {
      const savedWeights = await AsyncStorage.getItem(`weights_${id}`);
      if (savedWeights) {
        setWeights(JSON.parse(savedWeights));
      } else {
        setWeights(Array(exerciseCount).fill('')); // Initialize if no saved weights
      }
    } catch (error) {
      console.error('Error loading weights:', error);
    }
  };

  const saveWeights = async (updatedWeights) => {
    try {
      await AsyncStorage.setItem(`weights_${id}`, JSON.stringify(updatedWeights));
    } catch (error) {
      console.error('Error saving weights:', error);
    }
  };

  useEffect(() => {
    fetchWorkoutData();
    loadWeights(); // Load saved weights on component mount
  }, []);

  useEffect(() => {
    if (weights.length > 0) {
      saveWeights(weights);
    }
  }, [weights]);

  const currentExercise = exercises[currentExerciseIndex] || {};
  const currentVideoUri = currentExercise.exercise?.videoUrl || '';
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/countdown.wav')
      );
      setSound(sound);
    }

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        incrementTimeSpent()
        setTimer((prev) => {
          if (prev === 4) {
            playSound();
          }
          return Math.max(prev - 1, 0);
        });
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const playSound = async () => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
    if (!isTimerActive) {
      setTimer(30);
    }
  };


  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1); // Move to the next exercise
      playCountdownSound(); // Play countdown sound on exercise change
    }
  };
  
  
  const handleDone = () => {
    if (currentExerciseIndex === exercises.length - 1) {
      router.push('/home'); // Go back to home if done with workout
    } else {
      setCompletedExercises(prev => [...prev, currentExerciseIndex]);
      handleNext(); // Move to next exercise and play countdown
    }
  };
  

  const goToNextVideo = () => {
    if (currentVideoIndex < exercises.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  const visibleExercises = exercises.slice(currentExerciseIndex, currentExerciseIndex + VISIBLE_COUNT);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {currentVideoUri && (
          <Video
            source={{ uri: currentVideoUri }}
            style={styles.video}
            controls
            resizeMode="cover"
          />
        )}
         

        <View style={styles.timerContainer}>
          <Text style={styles.exerciseTitle}>{currentExercise.exercise?.name}</Text>
          <TouchableOpacity onPress={toggleTimer} style={styles.timerTouchable}>
            <FontAwesome5
              name="stopwatch"
              size={18}
              color={isTimerActive ? '#FF69B4' : '#9CA3AF'}
            />
            <Text style={[styles.timerText, { color: isTimerActive ? '#FF69B4' : '#9CA3AF' }]}>
              {timer} sec
            </Text>
          </TouchableOpacity>
          <Text style={styles.description}>
            {isDescriptionExpanded
              ? currentExercise.exercise?.description
              : currentExercise.exercise?.description?.length > 100
              ? `${currentExercise.exercise?.description.substring(0, 100)}...`
              : currentExercise.exercise?.description}
          </Text>
          {currentExercise.exercise?.description?.length > 15 && (
            <TouchableOpacity onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
              <Text style={styles.readMoreText}>{isDescriptionExpanded ? 'See less' : 'See more'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.highlightContainer}>
          <Text
            style={styles.boldHighlightedText}
            onLayout={(event) => setLineWidth(event.nativeEvent.layout.width)}
          >
            Ushtrimet e dites
          </Text>
          <View style={[styles.highlightedLine, { width: lineWidth }]} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {visibleExercises.map((exercise, index) => (
            <View key={index} style={[styles.scrollItem, index === 0 ? styles.highlighted : null]}>
              {index === 0 && (
                <TouchableOpacity style={styles.playIcon}>
                  <FontAwesome5 name={'play'} size={12} color={'#4B5563'} />
                </TouchableOpacity>
              )}
              <View style={styles.textContainer}>
                <Text style={styles.scrollText}>{exercise.exercise?.name}</Text>
              </View>
              <TextInput
  style={[styles.weightInput, focusedInputIndex === index ? styles.focusedInput : styles.unfocusedInput]}
  placeholder="Weight"
  keyboardType="numeric"
  value={weights[index]}
  onFocus={() => setFocusedInputIndex(index)}
  onBlur={() => setFocusedInputIndex(null)}
  onChangeText={(text) => {
    const updatedWeights = [...weights];
    updatedWeights[index] = text;
    setWeights(updatedWeights); // Updates and triggers AsyncStorage save
  }}
/>

            </View>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.buttonContainer, styles.nextButtonContainer]}>
        <TouchableOpacity style={styles.nextButton} onPress={() => { goToNextVideo(); handleDone(); }}>
          <Text style={styles.nextButtonText}>
            {currentExerciseIndex === exercises.length - 1 ? 'Done' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
  },
  video: {
    width: width - 32,
    height: IMG_HEIGHT,
    borderRadius: 16,
  },
  exerciseNameContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 8,
    width: '100%',
  },
  exerciseTitle: {
    fontSize: 24,
  },
  timerTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginVertical: 8,
    marginLeft: 25,
    justifyContent: 'space-between',
    gap: 5,
  },
  timerText: {
    fontSize: 16,
    marginLeft: 8,
  },
  descriptionContainer: {
    marginVertical: 16,
    width: '100%',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
  },
  readMoreText: {
    color: '#FF69B4',
    fontSize: 14,
  },
  highlightContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
    marginLeft: 7,
  },
  boldHighlightedText: {
    fontSize: 20,
    marginBottom: 4,
  },
  highlightedLine: {
    height: 2,
    backgroundColor: '#FF69B4',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    height: 55,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 5,
    marginRight: 5,
  },
  highlighted: {
    backgroundColor: 'rgb(222, 223, 228)',
  },
  scrollText: {
    fontSize: 16,
  },
  playIcon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  weightInput: {
    width: 70,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  unfocusedInput: {
    color: '#6B7280',
  },
  focusedInput: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonContainer: {
    padding: 16,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FF69B4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  nextButtonContainer: {
    padding: 16,
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default WorkoutView
