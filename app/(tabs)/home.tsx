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
    dispatch(fetchDestinations());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDestinations());
    setRefreshing(false);
  };

  const isFavorite = (id: number) => {
    return favorites.some((fav: Destination) => fav.id === id);
  };

  const handleToggleFavorite = (destination: Destination) => {
    dispatch(toggleFavorite(destination));
  };

  const filteredDestinations = destinations.filter((dest: Destination) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDestinationCard = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={[styles.card, isDarkMode && styles.cardDark]}
      onPress={() => router.push(`/details/${item.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleToggleFavorite(item)}
      >
        <Feather
          name={isFavorite(item.id) ? 'heart' : 'heart'}
          size={24}
          color={isFavorite(item.id) ? '#ff3b30' : '#fff'}
          style={isFavorite(item.id) ? styles.heartFilled : styles.heartOutline}
        />
      </TouchableOpacity>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isDarkMode && styles.textDark]} numberOfLines={1}>
            {item.name}
          </Text>
          {item.transportType && (
            <View style={styles.transportBadge}>
              <Feather name="navigation" size={12} color="#007AFF" />
              <Text style={styles.transportText}>{item.transportType}</Text>
            </View>
          )}
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
              Next: {item.schedule.split(', ')[0]}
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, getStatusColor(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          
          <Text style={[styles.priceText, isDarkMode && styles.textDark]}>
            ${item.price?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'Traveler'}!</Text>
            <Text style={styles.subtitle}>Find transport & explore destinations</Text>
          </View>
          <View style={styles.headerIcons}>
            <Feather name="bell" size={24} color={isDarkMode ? '#fff' : SwissColors.neutralCharcoal} />
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={isDarkMode ? '#888' : '#666'} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stations, routes..."
          placeholderTextColor={isDarkMode ? '#888' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={20} color={isDarkMode ? '#888' : '#666'} />
          </TouchableOpacity>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={filteredDestinations}
          renderItem={renderDestinationCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
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
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SCREEN_WIDTH * 0.05,
      paddingVertical: SCREEN_HEIGHT * 0.02,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#222' : SwissColors.steelGray + '30',
    },
    greeting: {
      fontSize: SCREEN_WIDTH * 0.06,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
    },
    subtitle: {
      fontSize: SCREEN_WIDTH * 0.035,
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
      marginTop: SCREEN_HEIGHT * 0.005,
    },
    headerIcons: {
      flexDirection: 'row',
      gap: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#111' : '#fff',
      marginHorizontal: SCREEN_WIDTH * 0.05,
      marginVertical: SCREEN_HEIGHT * 0.02,
      paddingHorizontal: SCREEN_WIDTH * 0.04,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : SwissColors.steelGray + '50',
    },
    searchIcon: {
      marginRight: SCREEN_WIDTH * 0.02,
    },
    searchInput: {
      flex: 1,
      height: SCREEN_HEIGHT * 0.055,
      fontSize: SCREEN_WIDTH * 0.04,
      color: isDarkMode ? '#fff' : '#000',
    },
    listContent: {
      paddingHorizontal: SCREEN_WIDTH * 0.05,
      paddingBottom: SCREEN_HEIGHT * 0.025,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      marginBottom: SCREEN_HEIGHT * 0.02,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    cardDark: {
      backgroundColor: '#111',
    },
    cardImage: {
      width: '100%',
      height: SCREEN_HEIGHT * 0.25,
      backgroundColor: isDarkMode ? '#222' : '#f0f0f0',
    },
    favoriteButton: {
      position: 'absolute',
      top: SCREEN_HEIGHT * 0.015,
      right: SCREEN_WIDTH * 0.03,
      width: SCREEN_WIDTH * 0.1,
      height: SCREEN_WIDTH * 0.1,
      borderRadius: SCREEN_WIDTH * 0.05,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heartFilled: {
      fontWeight: 'bold',
    },
    heartOutline: {
      fontWeight: 'normal',
    },
    cardContent: {
      padding: SCREEN_WIDTH * 0.04,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SCREEN_HEIGHT * 0.01,
    },
    cardTitle: {
      fontSize: SCREEN_WIDTH * 0.045,
      fontWeight: 'bold',
      color: SwissColors.neutralCharcoal,
      flex: 1,
    },
    transportBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: SwissColors.transportBlue + '15',
      paddingHorizontal: SCREEN_WIDTH * 0.02,
      paddingVertical: SCREEN_HEIGHT * 0.005,
      borderRadius: 8,
      gap: 4,
    },
    transportText: {
      fontSize: SCREEN_WIDTH * 0.028,
      color: SwissColors.transportBlue,
      fontWeight: '600',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SCREEN_HEIGHT * 0.01,
    },
    locationText: {
      fontSize: SCREEN_WIDTH * 0.035,
      color: SwissColors.textSecondary,
      marginLeft: SCREEN_WIDTH * 0.01,
      flex: 1,
    },
    scheduleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SCREEN_HEIGHT * 0.015,
    },
    scheduleText: {
      fontSize: SCREEN_WIDTH * 0.033,
      color: SwissColors.textSecondary,
      marginLeft: SCREEN_WIDTH * 0.01,
      fontWeight: '500',
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: SCREEN_WIDTH * 0.03,
      paddingVertical: SCREEN_HEIGHT * 0.005,
      borderRadius: 12,
    },
    statusText: {
      color: '#fff',
      fontSize: SCREEN_WIDTH * 0.03,
      fontWeight: '600',
    },
    priceText: {
      fontSize: SCREEN_WIDTH * 0.04,
      fontWeight: 'bold',
      color: SwissColors.transportBlue,
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
