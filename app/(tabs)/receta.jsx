import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const ProfileScreen = (props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with gradient */}
      <LinearGradient 
        colors={['#ffd9e5', '#E84479']}  // Pink gradient only
        start={[0, 0]} 
        end={[0, 1]} 
        locations={[0, 1]}  // Smooth gradient transition
        style={styles.header}
      >
        <Text style={styles.username}>Jhon Doe</Text>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Animatable.View animation="rotate" duration={2000} iterationCount={1}>
            <FontAwesome5 name="dumbbell" size={24} color="#FF1493" />
          </Animatable.View>
          <Text style={styles.statValue}>120</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Animatable.View animation="rotate" duration={2000} iterationCount={1}>
            <FontAwesome5 name="clock" size={24} color="#FF1493" />
          </Animatable.View>
          <Text style={styles.statValue}>4,320</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
      </View>

      {/* Days Active Section */}
      <View style={[styles.statsContainer, { marginTop: 40 }]}> 
        <View style={styles.statBoxRow}>
          <Animatable.View animation="rotate" duration={2000} iterationCount={1}>
            <FontAwesome5 name="calendar-check" size={28} color="#FF1493" style={styles.iconLeft} />
          </Animatable.View>
          <View>
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
        </View>
      </View>

      {/* Recent Activities Section */}
      <View style={[styles.statsContainer, { marginTop: 40 }]}> 
        <View style={styles.statBoxRow}>
          <Animatable.View animation="rotate" duration={2000} iterationCount={1}>
            <FontAwesome5 name="history" size={28} color="#FF1493" style={styles.iconLeft} />
          </Animatable.View>
          <View>
            <Text style={styles.statValue}>Recent Activities</Text>
            <Text style={styles.statLabel}>🏋️ Chest Day - 45 min</Text>
            <Text style={styles.statLabel}>🏃‍♂️ Cardio - 30 min</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    paddingBottom: 60,  // Increased bottom padding for more space
  },
  header: {
    width: '100%',
    paddingVertical: 100,  // Increased padding for a taller gradient
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 40,  // Increased marginTop to create more space between gradient and stats
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  statBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
  },
  iconLeft: {
    marginRight: 15,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;
  
