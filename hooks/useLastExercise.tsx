import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  rest: number;
  video?: string;
}

const useLastExercise = () => {
  const [lastExercise, setLastExercise] = useState<Exercise | null>(null);

  // Store the last exercise in AsyncStorage
  const storeLastExercise = async (exercise: Exercise) => {
    try {
      await AsyncStorage.setItem('lastExercise', JSON.stringify(exercise));
      setLastExercise(exercise);
    } catch (error) {
      console.error('Error storing exercise:', error);
    }
  };

  // Retrieve the last exercise from AsyncStorage
  const getLastExercise = async () => {
    try {
      const storedExercise = await AsyncStorage.getItem('lastExercise');
      if (storedExercise) {
        setLastExercise(JSON.parse(storedExercise));
      }
    } catch (error) {
      console.error('Error retrieving exercise:', error);
    }
  };

  useEffect(() => {
    getLastExercise(); // Fetch the last exercise on mount
  }, []);

  return { lastExercise, storeLastExercise };
};

export default useLastExercise; 