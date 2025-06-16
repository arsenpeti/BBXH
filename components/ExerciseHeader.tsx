import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ExerciseHeader = ({ 
  exerciseName, 
  description, 
  isDescriptionExpanded, 
  onToggleDescription,
  timer, 
  isTimerActive, 
  onToggleTimer 
}) => {
  return (
    <View style={styles.timerContainer}>
      <Text style={styles.exerciseTitle}>{exerciseName}</Text>
      <TouchableOpacity onPress={onToggleTimer} style={styles.timerTouchable}>
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
          ? description
          : description?.length > 100
          ? `${description.substring(0, 100)}...`
          : description}
      </Text>
      {description?.length > 15 && (
        <TouchableOpacity onPress={onToggleDescription}>
          <Text style={styles.readMoreText}>
            {isDescriptionExpanded ? 'See less' : 'See more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  description: {
    fontSize: 16,
    color: '#6B7280',
  },
  readMoreText: {
    color: '#FF69B4',
    fontSize: 14,
  },
});

export default ExerciseHeader;