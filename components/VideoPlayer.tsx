import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 235;

const VideoPlayer = ({ videoUri }) => {
  if (!videoUri) return null;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUri }}
        style={styles.video}
        controls
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  video: {
    width: width - 32,
    height: IMG_HEIGHT,
    borderRadius: 16,
  },
});

export default VideoPlayer;