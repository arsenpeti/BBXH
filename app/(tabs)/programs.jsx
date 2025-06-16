import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import usePurchasedPrograms from '../../hooks/usePurchasedPrograms';
import { router } from 'expo-router';

const ProgramsScreen = () => {
  const { purchasedPrograms, loading, error, refetch } = usePurchasedPrograms();

  const renderProgramItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.programCard}
      onPress={() => router.push(`/program/${item.id}`)}
    >
      <Text style={styles.programTitle}>{item.name}</Text>
      <Text style={styles.programDescription}>{item.description}</Text>
      <View style={styles.programMeta}>
        <Text style={styles.programDuration}>{item.duration} weeks</Text>
        <Text style={styles.programLevel}>{item.level}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#E84479" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Programs</Text>
      {purchasedPrograms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No programs purchased yet</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/programs/browse')}
          >
            <Text style={styles.browseButtonText}>Browse Programs</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={purchasedPrograms}
          renderItem={renderProgramItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  listContainer: {
    paddingBottom: 20,
  },
  programCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  programMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  programDuration: {
    fontSize: 14,
    color: '#E84479',
  },
  programLevel: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#E84479',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: '#E84479',
    padding: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProgramsScreen; 