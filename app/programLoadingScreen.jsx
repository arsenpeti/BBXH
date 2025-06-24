import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const ProgramLoadingScreen = () => {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim1 = useRef(new Animated.Value(0.3)).current;
  const fadeAnim2 = useRef(new Animated.Value(0.3)).current;
  const fadeAnim3 = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // Dots animation
    const dotsAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim1, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim2, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim3, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotation animation for dumbbell
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Start all animations
    pulseAnimation.start();
    dotsAnimation.start();
    rotationAnimation.start();

    // Cleanup
    return () => {
      pulseAnimation.stop();
      dotsAnimation.stop();
      rotationAnimation.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loadingContainer}>
      {/* Background circles */}
      <View style={styles.backgroundCircles}>
        <Animated.View 
          style={[
            styles.circle, 
            styles.circle1,
            { transform: [{ scale: pulseAnim }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.circle, 
            styles.circle2,
            { transform: [{ scale: pulseAnim }] }
          ]} 
        />
      </View>

      {/* Main content */}
      <Animated.View 
        style={[
          styles.mainContent,
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        {/* Rotating dumbbell icon */}
        <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }] }]}>
          <FontAwesome5 name="dumbbell" size={40} color="#E84479" />
        </Animated.View>

        {/* Loading text */}
        <Text style={styles.loadingText}>Preparing Program</Text>

        {/* Animated dots */}
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: fadeAnim1 }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim2 }]} />
          <Animated.View style={[styles.dot, { opacity: fadeAnim3 }]} />
        </View>
      </Animated.View>

      {/* Bottom accent */}
      <View style={styles.bottomAccent}>
        <Text style={styles.accentText}>Bodies By Xhes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    position: 'relative',
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(232, 68, 121, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
  },
  circle2: {
    width: 300,
    height: 300,
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#E84479',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#E84479',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E84479',
    marginHorizontal: 4,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  accentText: {
    fontSize: 16,
    color: '#E84479',
    fontWeight: '300',
    opacity: 0.7,
  },
});

export default ProgramLoadingScreen;