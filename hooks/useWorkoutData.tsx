import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useWorkoutData = (workoutId) => {
  const [workoutData, setWorkoutData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkoutData = async () => {
    const options = {
      method: 'GET',
      url: `https://stoplight.io/mocks/gym-app-ira/bodie-by-xhess/674100124/user/workouts/${workoutId}`,
      headers: { Accept: 'application/json', Authorization: 'Bearer 123' },
    };

    try {
      setLoading(true);
      console.log('Fetching workout data for ID:', workoutId);
      const { data } = await axios.request(options);
      console.log('Workout API Response:', JSON.stringify(data, null, 2));
      
      setWorkoutData(data.workout);
      setExercises(data.exercises);
      
      // Load saved weights
      await loadWeights(data.exercises.length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workout data:', error.response?.data || error.message);
      setError(error);
      setLoading(false);
    }
  };

  const loadWeights = async (exerciseCount) => {
    try {
      const savedWeights = await AsyncStorage.getItem(`weights_${workoutId}`);
      if (savedWeights) {
        setWeights(JSON.parse(savedWeights));
      } else {
        setWeights(Array(exerciseCount).fill(''));
      }
    } catch (error) {
      console.error('Error loading weights:', error);
    }
  };

  const saveWeights = async (updatedWeights) => {
    try {
      await AsyncStorage.setItem(`weights_${workoutId}`, JSON.stringify(updatedWeights));
    } catch (error) {
      console.error('Error saving weights:', error);
    }
  };

  const updateWeight = (index, value) => {
    const updatedWeights = [...weights];
    updatedWeights[index] = value;
    setWeights(updatedWeights);
  };

  useEffect(() => {
    if (workoutId) {
      fetchWorkoutData();
    }
  }, [workoutId]);

  useEffect(() => {
    if (weights.length > 0) {
      saveWeights(weights);
    }
  }, [weights]);

  return {
    workoutData,
    exercises,
    weights,
    loading,
    error,
    updateWeight,
    refetch: fetchWorkoutData,
  };
};

export default useWorkoutData;


