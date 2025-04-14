import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import BASE_URL from '../api/baseUrl.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // ✅ Step 3: If user already logged in, skip login
  useEffect(() => {
    const checkLogin = async () => {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail) {
        router.replace('/home'); // skip login
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          console.log("API HITTED");
          await AsyncStorage.setItem('userEmail', email);
          
          // ✅ Step 1: Replace instead of push
          router.replace('/home');
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrorMessage('An error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage('Email and password are required.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/Rectangle 23.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
          locations={[0.4, 1]}
          style={styles.gradient}
        />

        <View style={styles.content}>
          <Text style={styles.logo}>Bodies By Xhes</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '40%',
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: 20,
    alignItems: 'center',
    zIndex: 2,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Inter',
    color: '#FFFFFF',
    textAlign: 'center',
    position: 'absolute',
    top: '40%',
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
  },
  input: {
    width: 327,
    height: 44,
    backgroundColor: '#EEF2F5',
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#000',
    alignSelf: 'center',
  },
  loginButton: {
    width: 327,
    height: 43,
    backgroundColor: '#E84479',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#E84479',
    marginTop: 10,
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
