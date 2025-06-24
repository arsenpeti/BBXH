import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Exercise {
  id: string;
  name_al: string;
  name_en: string;
  description_al: string;
  description_en: string;
  video_url: string;
  image_url: string;
  sets: number;
  reps: number;
  rest_between_sets: number;
  instructions: {
    sq: string[];
    en: string[];
  };
}

interface ExerciseItemProps {
  exercise: Exercise;
  weight: string;
  isHighlighted: boolean;
  isFocused: boolean;
  onWeightChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const ExerciseItem = ({ 
  exercise, 
  weight, 
  isHighlighted, 
  isFocused, 
  onWeightChange, 
  onFocus, 
  onBlur 
}: ExerciseItemProps) => {
  return (
    <View style={[styles.scrollItem, isHighlighted ? styles.highlighted : null]}>
      {isHighlighted && (
        <TouchableOpacity style={styles.playIcon}>
          <FontAwesome5 name={'play'} size={12} color={'#4B5563'} />
        </TouchableOpacity>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.scrollText}>{exercise.name_al}</Text>
        <View style={styles.exerciseDetails}>
          <Text style={styles.detailText}>Sets: {exercise.sets}</Text>
          <Text style={styles.detailText}>Reps: {exercise.reps}</Text>
          <Text style={styles.detailText}>Rest: {exercise.rest_between_sets}s</Text>
        </View>
        {exercise.instructions?.sq && (
          <Text style={styles.instructions} numberOfLines={1}>
            {exercise.instructions.sq[0]}
          </Text>
        )}
      </View>
      <TextInput
        style={[
          styles.weightInput, 
          isFocused ? styles.focusedInput : styles.unfocusedInput
        ]}
        placeholder="Weight"
        keyboardType="numeric"
        value={weight}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={onWeightChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  highlighted: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E84479',
  },
  playIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  scrollText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  instructions: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  weightInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 16,
  },
  focusedInput: {
    borderColor: '#E84479',
    backgroundColor: '#FFF5F7',
  },
  unfocusedInput: {
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
});

export default ExerciseItem;