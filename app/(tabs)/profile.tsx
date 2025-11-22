import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/themeSlice';
import { SwissColors } from '@/constants/theme';

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
            <Feather name="map-pin" size={24} color={SwissColors.swissRed} />
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
              trackColor={{ false: '#ddd', true: SwissColors.swissRed }}
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
      backgroundColor: isDarkMode ? '#000' : SwissColors.swissWhite,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    avatarContainer: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: SwissColors.swissRed + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 4,
      borderColor: isDarkMode ? '#1C1C1C' : SwissColors.swissWhite,
      shadowColor: SwissColors.swissRed,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    name: {
      fontSize: 28,
      fontWeight: '800',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    username: {
      fontSize: 17,
      color: SwissColors.swissRed,
      marginBottom: 6,
      fontWeight: '600',
    },
    email: {
      fontSize: 14,
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#1C1C1C' : '#fff',
      paddingVertical: 28,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      marginTop: 16,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      backgroundColor: isDarkMode ? '#333' : SwissColors.steelGray + '30',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
      marginTop: 4,
    },
    section: {
      marginTop: 24,
      marginHorizontal: 20,
      backgroundColor: isDarkMode ? '#1C1C1C' : '#fff',
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : SwissColors.steelGray + '20',
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
      gap: 10,
      backgroundColor: 'transparent',
      marginHorizontal: 20,
      marginTop: 32,
      paddingVertical: 18,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: SwissColors.swissRed,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '600',
      color: SwissColors.swissRed,
    },
    version: {
      textAlign: 'center',
      fontSize: 12,
      color: isDarkMode ? '#666' : '#999',
      marginTop: 24,
    },
  });
