import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  rest: number;
  video?: string;
}

interface WorkoutData {
  exercises: Exercise[];
}

const useWorkoutData = () => {
  const params = useLocalSearchParams();
  const workoutId = params.id;
  
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For testing - log the workout ID
      console.log('Fetching workout with ID:', workoutId);

      // Hardcoded test data that matches the API response structure
      const testData: WorkoutData = {
        exercises: [
          {
            id: '1',
            name: 'Push Ups',
            description: 'Basic push ups',
            sets: 3,
            reps: 10,
            rest: 60,
            video: 'https://example.com/video.mp4'
          },
          {
            id: '2',
            name: 'Pull Ups',
            description: 'Basic pull ups',
            sets: 3,
            reps: 8,
            rest: 90,
            video: 'https://example.com/video2.mp4'
          }
        ]
      };

      // Set the test data
      setWorkoutData(testData);
      setIsLoading(false);

      /* Commenting out API call for now
      const response = await axios.get(`https://stoplight.io/mocks/gym-app-ira/bodie-by-xhess/674100124/user/workouts/${workoutId}`);
      console.log('API Response:', response.data);
      setWorkoutData(response.data);
      setIsLoading(false);
      */

    } catch (err) {
      console.error('Error in useWorkoutData:', err);
      setError('Failed to load workout');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutData();
  }, [workoutId]);

  return {
    workoutData,
    isLoading,
    error,
    refetch: fetchWorkoutData
  };
};

export default useWorkoutData;



