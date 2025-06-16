import { useState, useEffect } from 'react';

const useTimer = (initialTime = 30, onTimerEnd, incrementTimeSpent, playSound) => {
  const [timer, setTimer] = useState(initialTime);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        if (incrementTimeSpent) {
          incrementTimeSpent();
        }
        setTimer((prev) => {
          if (prev === 4 && playSound) {
            playSound();
          }
          return Math.max(prev - 1, 0);
        });
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      if (onTimerEnd) {
        onTimerEnd();
      }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, incrementTimeSpent, playSound, onTimerEnd]);

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
    if (!isTimerActive) {
      setTimer(initialTime);
    }
  };

  const resetTimer = () => {
    setTimer(initialTime);
    setIsTimerActive(false);
  };

  return {
    timer,
    isTimerActive,
    toggleTimer,
    resetTimer,
  };
};

export default useTimer;