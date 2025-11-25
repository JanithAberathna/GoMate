import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDestinations } from '@/store/slices/destinationsSlice';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { Destination } from '@/store/slices/destinationsSlice';
import { SwissColors } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { destinations, loading } = useAppSelector((state: any) => state.destinations);
  const { user } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state: any) => state.favorites.favorites);
  const isDarkMode = useAppSelector((state: any) => state.theme.isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Only fetch if destinations are empty
    if (destinations.length === 0) {
      dispatch(fetchDestinations(''));
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDestinations(searchQuery));
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2 || query.length === 0) {
      await dispatch(fetchDestinations(query));
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some((fav: Destination) => fav.id === id);
  };

  const handleToggleFavorite = (destination: Destination) => {
    dispatch(toggleFavorite(destination));
  };

  const renderDestinationCard = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={[styles.card, isDarkMode && styles.cardDark]}
      onPress={() => router.push(`/details/${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.imageOverlay} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(item)}
          activeOpacity={0.8}
        >
          <View style={styles.favoriteButtonInner}>
            <Feather
              name="heart"
              size={20}
              color={isFavorite(item.id) ? SwissColors.swissRed : '#666'}
              fill={isFavorite(item.id) ? SwissColors.swissRed : 'transparent'}
            />
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={[styles.cardTitle, isDarkMode && styles.textDark]} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={isDarkMode ? '#888' : '#666'} />
          <Text style={[styles.locationText, isDarkMode && styles.textSecondaryDark]} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        {item.schedule && (
          <View style={styles.scheduleRow}>
            <Feather name="clock" size={14} color={isDarkMode ? '#888' : '#666'} />
            <Text style={[styles.scheduleText, isDarkMode && styles.textSecondaryDark]} numberOfLines={1}>
              Next: {item.schedule.split(', ').slice(0, 3).join(', ')}...
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, getStatusColor(item.status)]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>from</Text>
            <Text style={[styles.priceText, isDarkMode && styles.textDark]}>
              ${item.price?.toFixed(0) || '0'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.firstName || 'Traveler'}! 👋</Text>
              <Text style={styles.subtitle}>Discover Swiss Train destinations</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Feather name="bell" size={22} color={isDarkMode ? '#fff' : SwissColors.neutralCharcoal} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.searchWrapper}>
        <TouchableOpacity 
          style={styles.journeyPlanButton}
          onPress={() => router.push('/journey/plan')}
        >
          <Feather name="navigation" size={20} color="#fff" />
          <Text style={styles.journeyPlanText}>Plan Journey</Text>
          <Feather name="arrow-right" size={16} color="#fff" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={SwissColors.swissRed} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Swiss stations..."
            placeholderTextColor={isDarkMode ? '#888' : '#999'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Feather name="x-circle" size={18} color={isDarkMode ? '#888' : '#666'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={SwissColors.swissRed} />
        </View>
      ) : (
        <FlatList
          data={destinations}
          renderItem={renderDestinationCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={SwissColors.swissRed} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={64} color={isDarkMode ? '#444' : '#ddd'} />
              <Text style={[styles.emptyText, isDarkMode && styles.textSecondaryDark]}>
                No destinations found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'operating':
    case 'active':
      return { backgroundColor: SwissColors.alpineGreen };
    case 'limited':
    case 'limited service':
      return { backgroundColor: SwissColors.cautionYellow };
    case 'unavailable':
    case 'closed':
      return { backgroundColor: SwissColors.swissRed };
    default:
      return { backgroundColor: SwissColors.steelGray };
  }
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : SwissColors.swissWhite,
    },
    safeArea: {
      backgroundColor: 'transparent',
    },
    header: {
      paddingHorizontal: SCREEN_WIDTH * 0.05,
      paddingVertical: SCREEN_HEIGHT * 0.025,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    greeting: {
      fontSize: SCREEN_WIDTH * 0.065,
      fontWeight: '800',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: SCREEN_WIDTH * 0.038,
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
      marginTop: SCREEN_HEIGHT * 0.006,
      fontWeight: '500',
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDarkMode ? '#1C1C1C' : SwissColors.swissWhite,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    notificationBadge: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: SwissColors.swissRed,
    },
    searchWrapper: {
      paddingHorizontal: SCREEN_WIDTH * 0.05,
      paddingVertical: SCREEN_HEIGHT * 0.02,
    },
    journeyPlanButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: SwissColors.swissRed,
      paddingHorizontal: SCREEN_WIDTH * 0.05,
      paddingVertical: SCREEN_HEIGHT * 0.018,
      borderRadius: 16,
      marginBottom: SCREEN_HEIGHT * 0.015,
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    journeyPlanText: {
      color: '#fff',
      fontSize: SCREEN_WIDTH * 0.042,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1C1C1C' : '#fff',
      paddingHorizontal: SCREEN_WIDTH * 0.04,
      paddingVertical: SCREEN_HEIGHT * 0.015,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0 : 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    searchIcon: {
      marginRight: SCREEN_WIDTH * 0.03,
    },
    clearButton: {
      padding: 4,
    },
    searchInput: {
      flex: 1,
      height: SCREEN_HEIGHT * 0.055,
      fontSize: SCREEN_WIDTH * 0.04,
      color: isDarkMode ? '#fff' : '#000',
    },
    listContent: {
      paddingHorizontal: SCREEN_WIDTH * 0.05,
      paddingTop: SCREEN_HEIGHT * 0.01,
      paddingBottom: SCREEN_HEIGHT * 0.025,
    },
    card: {
      backgroundColor: isDarkMode ? '#1C1C1C' : '#fff',
      borderRadius: 24,
      marginBottom: SCREEN_HEIGHT * 0.025,
      overflow: 'hidden',
      shadowColor: SwissColors.swissRed,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDarkMode ? 0 : 0.15,
      shadowRadius: 20,
      elevation: 8,
      borderWidth: isDarkMode ? 0 : 0,
    },
    cardDark: {
      backgroundColor: '#1C1C1C',
    },
    cardImageContainer: {
      position: 'relative',
      width: '100%',
      height: SCREEN_HEIGHT * 0.32,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      backgroundColor: isDarkMode ? '#222' : '#f0f0f0',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    favoriteButton: {
      position: 'absolute',
      top: SCREEN_HEIGHT * 0.018,
      right: SCREEN_WIDTH * 0.04,
      zIndex: 10,
    },
    favoriteButtonInner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    heartFilled: {
      fontWeight: 'bold',
    },
    heartOutline: {
      fontWeight: 'normal',
    },
    cardContent: {
      padding: SCREEN_WIDTH * 0.05,
    },
    cardHeader: {
      marginBottom: SCREEN_HEIGHT * 0.014,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    cardTitle: {
      fontSize: SCREEN_WIDTH * 0.052,
      fontWeight: '800',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
      flex: 1,
      letterSpacing: -0.5,
    },
    transportBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: SwissColors.swissRed + '15',
      paddingHorizontal: SCREEN_WIDTH * 0.025,
      paddingVertical: SCREEN_HEIGHT * 0.006,
      borderRadius: 12,
      gap: 4,
    },
    transportText: {
      fontSize: SCREEN_WIDTH * 0.03,
      color: SwissColors.swissRed,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SCREEN_HEIGHT * 0.012,
    },
    locationText: {
      fontSize: SCREEN_WIDTH * 0.037,
      color: isDarkMode ? '#999' : SwissColors.textSecondary,
      marginLeft: SCREEN_WIDTH * 0.015,
      flex: 1,
      fontWeight: '500',
    },
    scheduleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SCREEN_HEIGHT * 0.016,
      backgroundColor: isDarkMode ? '#2a2a2a' : SwissColors.swissWhite,
      paddingVertical: SCREEN_HEIGHT * 0.01,
      paddingHorizontal: SCREEN_WIDTH * 0.03,
      borderRadius: 12,
    },
    scheduleText: {
      fontSize: SCREEN_WIDTH * 0.035,
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
      marginLeft: SCREEN_WIDTH * 0.015,
      fontWeight: '600',
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SCREEN_HEIGHT * 0.01,
      paddingTop: SCREEN_HEIGHT * 0.012,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#2a2a2a' : '#f0f0f0',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SCREEN_WIDTH * 0.032,
      paddingVertical: SCREEN_HEIGHT * 0.007,
      borderRadius: 16,
      gap: 6,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#fff',
    },
    statusText: {
      color: '#fff',
      fontSize: SCREEN_WIDTH * 0.028,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    },
    priceContainer: {
      alignItems: 'flex-end',
    },
    priceLabel: {
      fontSize: SCREEN_WIDTH * 0.026,
      color: SwissColors.textSecondary,
      fontWeight: '500',
      marginBottom: 2,
    },
    priceText: {
      fontSize: SCREEN_WIDTH * 0.048,
      fontWeight: '800',
      color: SwissColors.swissRed,
      letterSpacing: -0.5,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      marginTop: 16,
    },
    textDark: {
      color: '#fff',
    },
    textSecondaryDark: {
      color: '#888',
    },
  });
