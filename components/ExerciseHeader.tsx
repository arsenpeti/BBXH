import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface ExerciseHeaderProps {
  exerciseName: {
    sq?: string;
    en?: string;
  };
  description?: string;
  isDescriptionExpanded: boolean;
  onToggleDescription: () => void;
  timer: number;
  isTimerActive: boolean;
  onToggleTimer: () => void;
  sets?: number;
  reps?: number;
  restBetweenSets?: number;
}

const ExerciseHeader = ({ 
  exerciseName,
  description,
  isDescriptionExpanded,
  onToggleDescription,
  timer,
  isTimerActive,
  onToggleTimer,
  sets,
  reps,
  restBetweenSets
}: ExerciseHeaderProps) => {
  const displayName = exerciseName?.sq || exerciseName?.en || 'Exercise';

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.exerciseTitle}>{displayName}</Text>
      
      <View style={styles.exerciseDetails}>
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

        <View style={styles.statsContainer}>
          {sets && (
            <View style={styles.statItem}>
              <FontAwesome5 name="dumbbell" size={14} color="#666" />
              <Text style={styles.statText}>{sets} sets</Text>
            </View>
          )}
          {reps && (
            <View style={styles.statItem}>
              <FontAwesome5 name="repeat" size={14} color="#666" />
              <Text style={styles.statText}>{reps} reps</Text>
            </View>
          )}
          {restBetweenSets && (
            <View style={styles.statItem}>
              <FontAwesome5 name="clock" size={14} color="#666" />
              <Text style={styles.statText}>{restBetweenSets}s rest</Text>
            </View>
          )}
        </View>
      </View>

      {description && (
        <>
          <Text style={styles.description}>
            {isDescriptionExpanded
              ? description
              : description.length > 100
              ? `${description.substring(0, 100)}...`
              : description}
          </Text>
          {description.length > 100 && (
            <TouchableOpacity onPress={onToggleDescription}>
              <Text style={styles.readMoreText}>
                {isDescriptionExpanded ? 'See less' : 'See more'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginVertical: 8,
    marginLeft: 25,
    justifyContent: 'space-between',
    gap: 5,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseDetails: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  readMoreText: {
    color: '#FF69B4',
    fontSize: 14,
    marginTop: 4,
  },
});

export default ExerciseHeader;