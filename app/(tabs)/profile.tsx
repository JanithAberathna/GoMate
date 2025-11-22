import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/themeSlice';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state: any) => state.theme.isDarkMode);
  const favorites = useAppSelector((state: any) => state.favorites.favorites);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logoutUser());
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleTheme());
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={48} color={isDarkMode ? '#fff' : '#000'} />
          </View>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.username}>@{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Feather name="heart" size={24} color="#ff3b30" />
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="map-pin" size={24} color="#007AFF" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Visited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="calendar" size={24} color="#34c759" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Planned</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name={isDarkMode ? 'moon' : 'sun'} size={20} color={isDarkMode ? '#fff' : '#000'} />
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="bell" size={20} color={isDarkMode ? '#fff' : '#000'} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#888' : '#999'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="globe" size={20} color={isDarkMode ? '#fff' : '#000'} />
              <Text style={styles.menuItemText}>Language</Text>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#888' : '#999'} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="info" size={20} color={isDarkMode ? '#fff' : '#000'} />
              <Text style={styles.menuItemText}>About GoMate</Text>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#888' : '#999'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="help-circle" size={20} color={isDarkMode ? '#fff' : '#000'} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#888' : '#999'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="shield" size={20} color={isDarkMode ? '#fff' : '#000'} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color={isDarkMode ? '#888' : '#999'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#ff3b30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#f5f5f5',
    },
    scrollContent: {
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 32,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#222' : '#e5e5e5',
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDarkMode ? '#222' : '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 4,
    },
    username: {
      fontSize: 16,
      color: '#007AFF',
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: isDarkMode ? '#888' : '#666',
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#000' : '#fff',
      paddingVertical: 24,
      paddingHorizontal: 20,
      marginTop: 1,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      backgroundColor: isDarkMode ? '#222' : '#e5e5e5',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? '#888' : '#666',
      marginTop: 4,
    },
    section: {
      marginTop: 24,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#888' : '#666',
      paddingHorizontal: 20,
      paddingVertical: 8,
      textTransform: 'uppercase',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#222' : '#f0f0f0',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuItemText: {
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: isDarkMode ? '#1a0000' : '#fff5f5',
      marginHorizontal: 20,
      marginTop: 32,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#ff3b30',
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ff3b30',
    },
    version: {
      textAlign: 'center',
      fontSize: 12,
      color: isDarkMode ? '#666' : '#999',
      marginTop: 24,
    },
  });
