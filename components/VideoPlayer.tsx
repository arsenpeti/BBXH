import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 235;

interface VideoPlayerProps {
  videoUri?: string | null;
  imageUri?: string | null;
}

const VideoPlayer = ({ videoUri, imageUri }: VideoPlayerProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  // Function to handle video playback status
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsVideoLoading(false);
      setIsPlaying(status.isPlaying);
    }
  };

  // Function to handle video load error
  const onVideoError = (error: string) => {
    console.log('Video error:', error);
    setVideoError(true);
    setIsVideoLoading(false);
  };

  // Function to toggle play/pause
  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  // If no media provided, return null
  if (!videoUri && !imageUri) return null;

  // If we have a video URI and no error, try to render video
  if (videoUri && !videoError) {
    return (
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          useNativeControls={true}
          shouldPlay={false} // Don't auto-play, let user control
          isLooping={false}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onError={onVideoError}
        />
        
        {/* Custom play button overlay (optional - remove if you prefer only native controls) */}
        {!isPlaying && !isVideoLoading && (
          <TouchableOpacity 
            style={styles.playButton}
            onPress={togglePlayPause}
          >
            <Ionicons name="play-circle" size={60} color="rgba(255, 255, 255, 0.8)" />
          </TouchableOpacity>
        )}
        
        {/* Loading indicator */}
        {isVideoLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
        
        {/* Error fallback - show image if available */}
        {videoError && imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.video}
            resizeMode="cover"
          />
        )}
      </View>
    );
  }

  // Fallback to image if video failed or no video provided
  if (imageUri) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: imageUri }}
          style={styles.video}
          resizeMode="cover"
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -16,
    position: 'relative',
  },
  video: {
    width: width,
    height: IMG_HEIGHT,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VideoPlayer;