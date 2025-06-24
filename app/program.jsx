import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const ProgramDetail = () => {
  const { program } = useLocalSearchParams();
  const programData = JSON.parse(program);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState('home'); // or 'gym'

  // Group weeks by variation
  const weeksByVariation = programData.weeks.reduce((acc, week) => {
    if (!acc[week.variation]) {
      acc[week.variation] = [];
    }
    acc[week.variation].push(week);
    return acc;
  }, {});

  const renderWeekCard = (week) => {
    const isSelected = selectedWeek?.id === week.id;
    return (
      <TouchableOpacity
        key={week.id}
        style={[styles.weekCard, isSelected && styles.selectedWeekCard]}
        onPress={() => setSelectedWeek(week)}
      >
        <Text style={styles.weekName}>{week.name}</Text>
        <Text style={styles.workoutCount}>
          {week.workouts?.length || 0} Workouts
        </Text>
      </TouchableOpacity>
    );
  };

  const renderWorkoutCard = (workout) => {
    return (
      <View key={workout.id} style={styles.workoutCard}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDescription}>{workout.description}</Text>
        <View style={styles.exerciseCount}>
          <FontAwesome5 name="dumbbell" size={16} color="#E84479" />
          <Text style={styles.exerciseCountText}>
            {workout.exercises?.length || 0} Exercises
          </Text>
        </View>
      </View>
    );
  };

  const renderExerciseList = (exercises) => {
    return exercises.map((exercise) => (
      <View key={exercise.id} style={styles.exerciseCard}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>
            {exercise.name.sq || exercise.name.en}
          </Text>
          <Text style={styles.exerciseDifficulty}>
            {exercise.difficulty}
          </Text>
        </View>
        <View style={styles.exerciseDetails}>
          <Text style={styles.exerciseDetail}>
            Sets: {exercise.sets}
          </Text>
          <Text style={styles.exerciseDetail}>
            Reps: {exercise.reps}
          </Text>
          <Text style={styles.exerciseDetail}>
            Rest: {exercise.restBetweenSets}s
          </Text>
        </View>
        {exercise.instructions?.sq && (
          <Text style={styles.exerciseInstructions}>
            {exercise.instructions.sq[0]}
          </Text>
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Program Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: programData.imageUrl }}
            style={styles.programImage}
          />
          <View style={styles.programInfo}>
            <Text style={styles.programName}>{programData.name}</Text>
            <Text style={styles.programDescription}>
              {programData.description}
            </Text>
            <Text style={styles.programPrice}>
              ${programData.price}
            </Text>
          </View>
        </View>

        {/* Variation Selector */}
        <View style={styles.variationSelector}>
          <TouchableOpacity
            style={[
              styles.variationButton,
              selectedVariation === 'home' && styles.selectedVariation,
            ]}
            onPress={() => setSelectedVariation('home')}
          >
            <Text style={styles.variationText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.variationButton,
              selectedVariation === 'gym' && styles.selectedVariation,
            ]}
            onPress={() => setSelectedVariation('gym')}
          >
            <Text style={styles.variationText}>Gym</Text>
          </TouchableOpacity>
        </View>

        {/* Weeks List */}
        <View style={styles.weeksContainer}>
          <Text style={styles.sectionTitle}>Weeks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weeksByVariation[selectedVariation]?.map(renderWeekCard)}
          </ScrollView>
        </View>

        {/* Selected Week Content */}
        {selectedWeek && (
          <View style={styles.selectedWeekContent}>
            <Text style={styles.sectionTitle}>Workouts</Text>
            {selectedWeek.workouts?.map(renderWorkoutCard)}

            {selectedWeek.workouts?.map((workout) => (
              <View key={workout.id} style={styles.workoutSection}>
                <Text style={styles.workoutSectionTitle}>
                  {workout.name} Exercises
                </Text>
                {renderExerciseList(workout.exercises)}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 300,
  },
  programImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  programInfo: {
    padding: 16,
  },
  programName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  programPrice: {
    fontSize: 20,
    color: '#E84479',
    fontWeight: 'bold',
  },
  variationSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  variationButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedVariation: {
    backgroundColor: '#E84479',
  },
  variationText: {
    fontSize: 16,
    color: '#333',
  },
  weeksContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  weekCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 12,
    minWidth: 150,
  },
  selectedWeekCard: {
    backgroundColor: '#E84479',
  },
  weekName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutCount: {
    fontSize: 14,
    color: '#666',
  },
  workoutCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  exerciseCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseCountText: {
    fontSize: 14,
    color: '#E84479',
  },
  workoutSection: {
    marginTop: 24,
  },
  workoutSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exerciseCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDifficulty: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666',
  },
  exerciseInstructions: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ProgramDetail; 