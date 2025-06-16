import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useTimeSpent = (storageKey) => {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const fetchTimeSpent = async () => {
      try {
        const storedTimeSpent = await AsyncStorage.getItem(storageKey);
        if (storedTimeSpent) {
          setTimeSpent(parseInt(storedTimeSpent, 10));
        }
      } catch (error) {
        console.error('Error loading time spent:', error);
      }
    };

    fetchTimeSpent();
  }, [storageKey]);

  const incrementTimeSpent = async (seconds = 1) => {
    try {
      const storedTime = await AsyncStorage.getItem(storageKey);
      console.log('incrementTimeSpent storedTime', storedTime)
      let val = 1;
      if(storedTime) {
       val = parseInt(storedTime) + seconds
       
      }
      console.log('stored time val', val.toString())
      console.log('incrementing time spent', val)
      await AsyncStorage.setItem("timeSpent", val.toString())
    }catch(error) {
      console.log('Error saving time spent: ', error)
    }
  }

  useEffect(() => {
    const saveTimeSpent = async () => {
      try {
        await AsyncStorage.setItem(storageKey, timeSpent.toString());
        console.log("Saving Time Spent",timeSpent.toString())
      } catch (error) {
        console.error('Error saving time spent:', error);
      }
    };

    if (timeSpent !== 0) {
      saveTimeSpent();
    }
  }, [timeSpent, storageKey]);

  return {incrementTimeSpent}
};

export default useTimeSpent;
