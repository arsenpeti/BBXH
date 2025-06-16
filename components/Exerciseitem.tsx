import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ExerciseItem = ({ 
  exercise, 
  weight, 
  isHighlighted, 
  isFocused, 
  onWeightChange, 
  onFocus, 
  onBlur 
}) => {
  return (
    <View style={[styles.scrollItem, isHighlighted ? styles.highlighted : null]}>
      {isHighlighted && (
        <TouchableOpacity style={styles.playIcon}>
          <FontAwesome5 name={'play'} size={12} color={'#4B5563'} />
        </TouchableOpacity>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.scrollText}>{exercise?.name}</Text>
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
    justifyContent: 'space-between',
    padding: 12,
    height: 55,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 5,
    marginRight: 5,
  },
  highlighted: {
    backgroundColor: 'rgb(222, 223, 228)',
  },
  scrollText: {
    fontSize: 16,
  },
  playIcon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  weightInput: {
    width: 70,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  unfocusedInput: {
    color: '#6B7280',
  },
  focusedInput: {
    backgroundColor: '#D1D5DB',
  },
});

export default ExerciseItem;