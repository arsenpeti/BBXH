import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import axios from 'axios';

const App = () => {
  const [arr, setItems] = useState([1, 2, 3, 4]); // Days list
  const [currentDay, setCurrentDay] = useState(1); // Track the current unlocked day
  const [isHome, setIsHome] = useState(true);
  const [programData, setProgramData] = useState(null); // Store the program data
  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter();

  // const navigation = useNavigation

  const handlePress = () => {
    if (isHome) {
      setIsHome(false);
      setItems([5, 6, 7, 8]); // Update to another set of items for the dumbbell icon
    } else {
      setIsHome(true);
      setItems([1, 2, 3, 4]); // Reset back to the original set of items
    }
  };

  // Fetch program data from the API
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://stoplight.io/mocks/gym-app-ira/bodie-by-xhess/674100124/user/my-program',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer 123', // Replace '123' with the actual bearer token
          },
        };

        const { data } = await axios.request(options);
        setProgramData(data);
        setLoading(false); // Set loading to false when the data is fetched
      } catch (error) {
        console.error('Error fetching program data:', error);
        setLoading(false);
      }
    };

    fetchProgramData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Render the fetched program data
  const program = programData?.program;
  const weeks = programData?.weeks || [];

  return (
    <>
      <SafeAreaView style={styles.ara}>
        {/* Header outside SafeAreaView */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Mirmegjesi {program?.name}</Text>
          </View>
          <View style={styles.headerContent}>
            {/* Horizontal ScrollView */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              style={styles.scrollView}
            >
              {Array.from({ length: 15 }, (_, index) => {
                const day = index + 1;
                return (
                  <View key={index} style={styles.circle}>
                    <Text style={styles.circleText}>{day}</Text>
                    {/* If the current day is locked, add the lock icon */}
                    {day > currentDay && (
                      <MaterialIcons
                        name="lock"
                        size={16} // Reduced lock icon size
                        color="#fff"
                        style={styles.lockIcon}
                      />
                    )}
                  </View>
                );
              })}
            </ScrollView>
            {/* Home / Dumbbell Icon */}
            <View style={styles.iconWrapper}>
              <TouchableOpacity onPress={handlePress}>
                {isHome ? (
                  <MaterialIcons name="home" size={30} color="white" />
                ) : (
                  <FontAwesome5 name="dumbbell" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* SafeAreaView for remaining content */}
      <SafeAreaView style={styles.safeArea}>
        {/* ScrollView for containers */}
        <ScrollView
          contentContainerStyle={styles.scrollViewContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {weeks.map((week, index) => (
            <TouchableOpacity
              key={index}
              style={styles.containerBox}
              onPress={() => {
                // Unlock next day when a day is clicked
                if (index + 1 === currentDay) {
                  setCurrentDay((prevDay) => prevDay + 1);
                }
                // console.log(`workout id ${week.workouts[0].id}`)
                // Pass the workout ID to the next page
                const workoutId = week.workouts[0].id
                router.push({
                  pathname: 'workout',
                  params: { id: workoutId },
                });
              }}
            >
              {/* Image Section */}
              <Image
                source={{ uri: week?.workouts[0]?.imageUrl || 'https://via.placeholder.com/150' }} // Use the workout's image URL if available
                style={styles.image}
              />
              {/* Text Section */}
              <View style={styles.textSection}>
                <Text style={styles.weekText}>Week {week?.order + 1}</Text>
                <Text style={styles.containerText}>{week?.name}</Text>
                <View style={styles.timerSection}>
                  <FontAwesome5 name="clock" size={14} color="#999" />
                  <Text style={styles.timerText}>30 seconds</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  ara: {
    paddingBottom: -50,
    backgroundColor: '#EF87AA',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  /* Header styles */
  header: {
    backgroundColor: '#EF87AA',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Added margin to create space between the text and ScrollView
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 0,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#E84479',
    position: 'relative', // Needed to position the lock icon inside the circle
  },
  circleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
  lockIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E84479',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  /* ScrollView content styles */
  scrollViewContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flexGrow: 1,
  },
  /* Container styles */
  containerBox: {
    width: '90%',
    maxWidth: 337,
    height: 210,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 120,
  },
  textSection: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  weekText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'left',
    marginBottom: 5,
  },
  containerText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timerText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
});

export default App;
