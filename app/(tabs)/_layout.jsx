import React from 'react'; 
import { View, Image, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router'; 
import icons from '../../constants/icons'; // Ensure this path is correct

// Tab icon component
const TabIcon = ({ icon, isActive }) => {
  return (
    <View style={styles.iconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[styles.icon, isActive && styles.activeIcon]} // Apply active icon style when active
      />
      {/* Show thin line under active icon */}
      {isActive && <View style={styles.activeIndicator} />}
    </View>
  );
};

// Layout for the Tab bar
const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 80, // Adjusted tab bar height
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF', // Tab bar background color
          borderTopWidth: 1,
          borderTopColor: '#FFFFFF', // Set the border color to white
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} isActive={focused} /> // Pass 'focused' state to the icon
          ),
        }}
      />
      <Tabs.Screen
        name="receta"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.bookmark} isActive={focused} /> // Pass 'focused' state to the icon
          ),
        }}
      />
    </Tabs>
  );
};

// Styles for the Tab icons and the active line
const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,  // Adjusted to move icons lower
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#D3D3D3', // Default color for inactive icon (light gray)
  },
  activeIcon: {
    tintColor: '#E84479', // Active icon color (pink)
  },
  activeIndicator: {
    height: 2, // Thickness of the active indicator line
    backgroundColor: '#E84479', // Same color as active icon
    width: 20, // Reduced width of the line (smaller)
    marginTop: 5, // Small space between icon and line
    borderRadius: 1, // Rounded corners for the line
  },
});

export default Layout;