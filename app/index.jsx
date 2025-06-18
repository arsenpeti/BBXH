import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    console.log('Login button pressed'); // Debug log
    
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log('Attempting login with email:', email);
      const response = await apiClient.post('/auth/login', { email, password });
      console.log('Login response:', response); // Log the full response
      
      if (!response.token) {
        throw new Error('Invalid response from server: No token received');
      }

      // Store the authentication token
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('userEmail', email);
      
      // Store user data if available
      if (response.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      }

      // Verify token was stored
      const storedToken = await AsyncStorage.getItem('authToken');
      console.log('Stored token:', storedToken ? 'Token stored successfully' : 'Failed to store token');
      
      router.replace('/home');
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Session expired')) {
        setErrorMessage('Your session has expired. Please login again.');
      } else {
        setErrorMessage(error.message || 'An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password pressed'); // Debug log
    router.push('/forgot-password');
  };

  // Test function to verify touch events work
  const testTouch = () => {
    console.log('Test button pressed');
    Alert.alert('Test', 'Touch events are working!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ImageBackground
          source={require('../assets/images/Rectangle 23.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
            locations={[0.4, 1]}
            style={styles.gradient}
            pointerEvents="none"
          />

          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>Bodies By Xhes</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
            
                    setEmail(text);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={true}
                  selectTextOnFocus={true}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                   
                    setPassword(text);
                  }}
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>

              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleForgotPassword}
                activeOpacity={0.7}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60%',
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 50 : 20,
    minHeight: '100%',
    zIndex: 2,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 250,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    zIndex: 3, // Ensure form is above everything
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 3,
  },
  input: {
    width: '100%',
    maxWidth: 327,
    height: 44,
    backgroundColor: '#EEF2F5',
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
    zIndex: 3,
  },
  loginButton: {
    width: '100%',
    maxWidth: 327,
    height: 43,
    backgroundColor: '#E84479',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    zIndex: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 10,
    padding: 10,
    zIndex: 3,
  },
  forgotPasswordText: {
    color: '#E84479',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Login;