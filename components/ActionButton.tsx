import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ActionButton = ({ title, onPress, style, textStyle }) => {
  return (
    <View style={[styles.buttonContainer, style]}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF69B4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default ActionButton;