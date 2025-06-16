import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SectionHighlight = ({ title }) => {
  const [lineWidth, setLineWidth] = useState(0);

  const handleLayout = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    setLineWidth(width);
  }, []);

  return (
    <View style={styles.highlightContainer}>
      <Text
        style={styles.boldHighlightedText}
        onLayout={handleLayout}
      >
        {title}
      </Text>
      <View style={[styles.highlightedLine, { width: lineWidth }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  highlightContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
    marginLeft: 7,
  },
  boldHighlightedText: {
    fontSize: 20,
    marginBottom: 4,
  },
  highlightedLine: {
    height: 2,
    backgroundColor: '#FF69B4',
  },
});

export default SectionHighlight;