import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import { SwissColors } from '@/constants/theme';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
});

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state: any) => state.theme.isDarkMode);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', 'Invalid username or password');
      dispatch(clearError());
    }
  }, [error]);

  const handleLogin = async (values: { username: string; password: string }) => {
    await dispatch(loginUser(values));
  };

  const styles = getStyles(isDarkMode);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Feather name="map-pin" size={60} color={SwissColors.swissRed} />
          <Text style={styles.title}>GoMate</Text>
          <Text style={styles.subtitle}>Swiss Travel Companion</Text>
        </View>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color={isDarkMode ? '#888' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor={isDarkMode ? '#888' : '#999'}
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  autoCapitalize="none"
                />
              </View>
              {touched.username && errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color={isDarkMode ? '#888' : '#666'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={isDarkMode ? '#888' : '#999'}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={isDarkMode ? '#888' : '#666'}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/auth/register')}
              >
                <Text style={styles.secondaryButtonText}>Create New Account</Text>
              </TouchableOpacity>

              <View style={styles.demoCredentials}>
                <Text style={styles.demoTitle}>Demo Credentials:</Text>
                <Text style={styles.demoText}>Username: user</Text>
                <Text style={styles.demoText}>Password: user123</Text>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: SCREEN_WIDTH * 0.05,
    },
    header: {
      alignItems: 'center',
      marginBottom: SCREEN_HEIGHT * 0.05,
    },
    title: {
      fontSize: SCREEN_WIDTH * 0.08,
      fontWeight: 'bold',
      marginTop: SCREEN_HEIGHT * 0.02,
      color: isDarkMode ? '#fff' : '#000',
    },
    subtitle: {
      fontSize: SCREEN_WIDTH * 0.04,
      color: isDarkMode ? '#888' : '#666',
      marginTop: SCREEN_HEIGHT * 0.01,
    },
    form: {
      width: '100%',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#ddd',
      borderRadius: 12,
      marginBottom: SCREEN_HEIGHT * 0.01,
      paddingHorizontal: SCREEN_WIDTH * 0.04,
      backgroundColor: isDarkMode ? '#111' : '#f9f9f9',
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    eyeIcon: {
      padding: 8,
    },
    errorText: {
      color: '#ff3b30',
      fontSize: 12,
      marginBottom: 12,
      marginLeft: 4,
    },
    button: {
      backgroundColor: SwissColors.swissRed,
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: isDarkMode ? '#333' : '#ddd',
    },
    dividerText: {
      marginHorizontal: 16,
      color: isDarkMode ? '#888' : '#666',
      fontSize: 14,
    },
    secondaryButton: {
      borderWidth: 1,
      borderColor: SwissColors.swissRed,
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: SwissColors.swissRed,
      fontSize: 16,
      fontWeight: '600',
    },
    demoCredentials: {
      marginTop: 24,
      padding: 16,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
      borderRadius: 12,
    },
    demoTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
      color: isDarkMode ? '#fff' : '#000',
    },
    demoText: {
      fontSize: 12,
      color: isDarkMode ? '#888' : '#666',
      marginBottom: 4,
    },
  });
