import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDestinationById } from '@/store/slices/destinationsSlice';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { SwissColors } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DestinationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { selectedDestination, loading } = useAppSelector((state: any) => state.destinations);
  const favorites = useAppSelector((state: any) => state.favorites.favorites);
  const isDarkMode = useAppSelector((state: any) => state.theme.isDarkMode);

  useEffect(() => {
    if (id) {
      dispatch(fetchDestinationById(Number(id)));
    }
  }, [id]);

  const isFavorite = selectedDestination
    ? favorites.some((fav: any) => fav.id === selectedDestination.id)
    : false;

  const handleToggleFavorite = () => {
    if (selectedDestination) {
      dispatch(toggleFavorite(selectedDestination));
    }
  };

  const styles = getStyles(isDarkMode);

  if (loading || !selectedDestination) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SwissColors.swissRed} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedDestination.image }} style={styles.image} />
          
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerButton} onPress={handleToggleFavorite}>
              <Feather
                name={isFavorite ? 'heart' : 'heart'}
                size={24}
                color={isFavorite ? '#ff3b30' : '#fff'}
                style={isFavorite ? { fontWeight: 'bold' } : {}}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.statusBadge, getStatusColor(selectedDestination.status)]}>
            <Text style={styles.statusText}>{selectedDestination.status}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{selectedDestination.name}</Text>
            {selectedDestination.transportType && (
              <View style={styles.transportBadge}>
                <Feather name="navigation" size={16} color={SwissColors.swissRed} />
                <Text style={styles.transportText}>{selectedDestination.transportType}</Text>
              </View>
            )}
          </View>

          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={18} color={isDarkMode ? '#888' : '#666'} />
            <Text style={styles.locationText}>{selectedDestination.location}</Text>
          </View>

          {selectedDestination.schedule && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="clock" size={20} color={SwissColors.swissRed} />
                <Text style={styles.sectionTitle}>Schedule</Text>
              </View>
              <View style={styles.scheduleGrid}>
                {selectedDestination.schedule.split(', ').map((time: string, index: number) => (
                  <View key={index} style={styles.scheduleItem}>
                    <Text style={styles.scheduleTime}>{time}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="info" size={20} color={SwissColors.swissRed} />
              <Text style={styles.sectionTitle}>About This Hub</Text>
            </View>
            <Text style={styles.description}>{selectedDestination.description}</Text>
          </View>

          {selectedDestination.price && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="dollar-sign" size={20} color={SwissColors.swissRed} />
                <Text style={styles.sectionTitle}>Ticket Price</Text>
              </View>
              <Text style={styles.priceText}>${selectedDestination.price.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="list" size={20} color={SwissColors.swissRed} />
              <Text style={styles.sectionTitle}>Facilities</Text>
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Feather name="check-circle" size={18} color="#34c759" />
                <Text style={styles.featureText}>WiFi Available</Text>
              </View>
              <View style={styles.featureItem}>
                <Feather name="check-circle" size={18} color="#34c759" />
                <Text style={styles.featureText}>Wheelchair Accessible</Text>
              </View>
              <View style={styles.featureItem}>
                <Feather name="check-circle" size={18} color="#34c759" />
                <Text style={styles.featureText}>Ticket Machines</Text>
              </View>
              <View style={styles.featureItem}>
                <Feather name="check-circle" size={18} color="#34c759" />
                <Text style={styles.featureText}>Real-time Updates</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          {selectedDestination.price && (
            <>
              <Text style={styles.footerLabel}>Starting from</Text>
              <Text style={styles.footerPrice}>${selectedDestination.price}</Text>
            </>
          )}
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return { backgroundColor: '#34c759' };
    case 'limited':
      return { backgroundColor: '#ff9500' };
    case 'unavailable':
      return { backgroundColor: '#ff3b30' };
    default:
      return { backgroundColor: '#888' };
  }
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.4,
      backgroundColor: isDarkMode ? '#222' : '#f0f0f0',
    },
    headerButtons: {
      position: 'absolute',
      top: SCREEN_HEIGHT * 0.05,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: SCREEN_WIDTH * 0.05,
    },
    headerButton: {
      width: SCREEN_WIDTH * 0.1,
      height: SCREEN_WIDTH * 0.1,
      borderRadius: SCREEN_WIDTH * 0.05,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusBadge: {
      position: 'absolute',
      bottom: SCREEN_HEIGHT * 0.025,
      left: SCREEN_WIDTH * 0.05,
      paddingHorizontal: SCREEN_WIDTH * 0.04,
      paddingVertical: SCREEN_HEIGHT * 0.01,
      borderRadius: 16,
    },
    statusText: {
      color: '#fff',
      fontSize: SCREEN_WIDTH * 0.035,
      fontWeight: '600',
    },
    content: {
      padding: SCREEN_WIDTH * 0.05,
    },
    titleSection: {
      marginBottom: SCREEN_HEIGHT * 0.015,
    },
    title: {
      fontSize: SCREEN_WIDTH * 0.07,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      flex: 1,
      marginRight: SCREEN_WIDTH * 0.03,
    },
    transportBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E3F2FD',
      paddingHorizontal: SCREEN_WIDTH * 0.03,
      paddingVertical: SCREEN_HEIGHT * 0.01,
      borderRadius: 12,
      gap: 6,
      marginTop: SCREEN_HEIGHT * 0.01,
      alignSelf: 'flex-start',
    },
    transportText: {
      fontSize: SCREEN_WIDTH * 0.035,
      color: SwissColors.swissRed,
      fontWeight: '600',
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SCREEN_WIDTH * 0.02,
      marginBottom: SCREEN_HEIGHT * 0.03,
    },
    locationText: {
      fontSize: SCREEN_WIDTH * 0.04,
      color: isDarkMode ? '#888' : '#666',
    },
    section: {
      marginBottom: SCREEN_HEIGHT * 0.03,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: isDarkMode ? '#ccc' : '#333',
    },
    scheduleGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    scheduleItem: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#e0e0e0',
    },
    scheduleTime: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#000',
      textTransform: 'capitalize',
    },
    priceText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: SwissColors.swissRed,
    },
    featuresList: {
      gap: 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    featureText: {
      fontSize: 16,
      color: isDarkMode ? '#ccc' : '#333',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#222' : '#e5e5e5',
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    footerLabel: {
      fontSize: 12,
      color: isDarkMode ? '#888' : '#666',
    },
    footerPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    bookButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: SwissColors.swissRed,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
    },
    bookButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
