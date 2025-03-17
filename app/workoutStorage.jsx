import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get the current workout count
export const getWorkoutCount = async () => {
  try {
    const storedWorkouts = await AsyncStorage.getItem('workoutCount');
    console.log('Retrieved workout count:', storedWorkouts); // Debugging log
    return storedWorkouts ? parseInt(storedWorkouts, 10) : 0;
  } catch (error) {
    console.error('Error retrieving workout count:', error);
    return 0;
  }
};

// Function to increment the workout count
export const incrementWorkoutCount = async () => {
  try {
    const currentCount = await getWorkoutCount();
    const newCount = currentCount + 1;
    await AsyncStorage.setItem('workoutCount', newCount.toString());
    console.log('Updated workout count:', newCount); // Debugging log
    return newCount;
  } catch (error) {
    console.error('Error updating workout count:', error);
  }
};