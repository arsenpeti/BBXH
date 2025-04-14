// useLastExercise.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLastExercise = () => {
  const [lastExercise, setLastExercise] = useState(null);

  // Store the last exercise in AsyncStorage
  const storeLastExercise = async (exercise) => {
    try {
      await AsyncStorage.setItem('lastExercise', JSON.stringify(exercise));
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
