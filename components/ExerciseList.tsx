import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ExerciseItem from './Exerciseitem';

const ExerciseList = ({ 
  exercises, 
  weights, 
  focusedInputIndex, 
  currentExerciseIndex,
  onWeightChange, 
  onInputFocus, 
  onInputBlur 
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {exercises.map((exercise, index) => (
        <ExerciseItem
          key={index}
          exercise={exercise.exercise}
          weight={weights[currentExerciseIndex + index] || ''}
          isHighlighted={index === 0}
          isFocused={focusedInputIndex === index}
          onWeightChange={(text) => onWeightChange(currentExerciseIndex + index, text)}
          onFocus={() => onInputFocus(index)}
          onBlur={() => onInputBlur()}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default ExerciseList;