import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ExerciseItem from './Exerciseitem';

interface Exercise {
  id: string;
  exerciseId?: string;
  name_al: string;
  name_en: string;
  name?: string;
  exercise?: string;
  description_al: string;
  description_en: string;
  video_url: string;
  image_url: string;
  sets: number;
  reps: number;
  rest_between_sets: number;
  weight?: number;
  instructions: {
    sq: string[];
    en: string[];
  };
}

interface ExerciseListProps {
  exercises: Exercise[];
  weights: { exerciseId: string; weight: number }[];
  focusedInputIndex: number | null;
  currentExerciseIndex: number;
  onWeightChange: (exerciseId: string, value: string) => void;
  onInputFocus: (index: number) => void;
  onInputBlur: () => void;
}

const ExerciseList = ({ 
  exercises, 
  weights,
  focusedInputIndex,
  currentExerciseIndex,
  onWeightChange, 
  onInputFocus, 
  onInputBlur 
}: ExerciseListProps) => {
  
  // Helper function to get a consistent exercise ID
  const getExerciseId = (exercise: Exercise, index: number) => {
    // Priority: exerciseId > id > fallback with name
    return exercise.exerciseId || 
           exercise.id || 
           `exercise_${exercise.name || exercise.exercise || index}`;
  };

  // Helper function to get weight for a specific exercise
  const getWeightForExercise = (exercise: Exercise, index: number) => {
    const exerciseId = getExerciseId(exercise, index);
    const weightData = weights.find(w => w.exerciseId === exerciseId);
    
    if (weightData && weightData.weight !== undefined && weightData.weight !== null) {
      return weightData.weight; // Return as string (could be empty)
    }
    
    // Fallback to exercise default weight or 0
    return exercise.weight?.toString() || '0';
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {exercises.map((exercise, index) => {
        const exerciseId = getExerciseId(exercise, index);
        const currentWeight = getWeightForExercise(exercise, index);
        
        return (
          <ExerciseItem
            key={exerciseId} // Use consistent ID as key
            exercise={exercise}
            weight={currentWeight}
            isHighlighted={index === currentExerciseIndex}
            isFocused={focusedInputIndex === index}
            onWeightChange={(text: string) => onWeightChange(exerciseId, text)}
            onFocus={() => onInputFocus(index)}
            onBlur={onInputBlur}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
});

export default ExerciseList;