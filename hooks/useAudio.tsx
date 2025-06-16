import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const useAudio = (soundPath) => {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(soundPath);
        setSound(sound);
        await sound.replayAsync();
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    }

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [soundPath]);

  const playSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  return { playSound };
};

export default useAudio;