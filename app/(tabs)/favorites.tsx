import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { Destination } from '@/store/slices/destinationsSlice';
import { SwissColors } from '@/constants/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state: any) => state.favorites.favorites);
  const isDarkMode = useAppSelector((state: any) => state.theme.isDarkMode);

  const handleRemoveFavorite = (destination: Destination) => {
    dispatch(toggleFavorite(destination));
  };

  const renderFavoriteCard = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={[styles.card, isDarkMode && styles.cardDark]}
      onPress={() => router.push(`/details/${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.imageGradient} />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isDarkMode && styles.textDark]} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity 
            onPress={() => handleRemoveFavorite(item)}
            style={styles.heartButton}
            activeOpacity={0.7}
          >
            <Feather name="heart" size={20} color={SwissColors.swissRed} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={isDarkMode ? '#888' : '#666'} />
          <Text style={[styles.locationText, isDarkMode && styles.textSecondaryDark]} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <Text style={[styles.descriptionText, isDarkMode && styles.textSecondaryDark]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, getStatusColor(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          
          <View style={styles.ratingRow}>
            <Feather name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, isDarkMode && styles.textDark]}>
              {item.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
        <Text style={styles.count}>{favorites.length} saved</Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={64} color={isDarkMode ? '#444' : '#ddd'} />
            <Text style={[styles.emptyTitle, isDarkMode && styles.textDark]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyText, isDarkMode && styles.textSecondaryDark]}>
              Start exploring and save your favorite destinations
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/home')}
            >
              <Text style={styles.exploreButtonText}>Explore Destinations</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
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
    header: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0 : 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
      letterSpacing: -0.5,
    },
    count: {
      fontSize: 14,
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
      marginTop: 4,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 100,
    },
    card: {
      backgroundColor: isDarkMode ? '#1C1C1C' : '#fff',
      borderRadius: 20,
      marginBottom: 16,
      overflow: 'hidden',
      flexDirection: 'row',
      height: 160,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDarkMode ? 0 : 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
    cardDark: {
      backgroundColor: '#1C1C1C',
    },
    imageContainer: {
      position: 'relative',
      width: 130,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      backgroundColor: isDarkMode ? '#222' : '#f0f0f0',
    },
    imageGradient: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 30,
      backgroundColor: isDarkMode ? 'rgba(28, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    },
    cardContent: {
      flex: 1,
      padding: 16,
      justifyContent: 'space-between',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    heartButton: {
      padding: 4,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: SwissColors.neutralCharcoal,
      flex: 1,
      marginRight: 8,
      letterSpacing: -0.3,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    locationText: {
      fontSize: 12,
      color: SwissColors.textSecondary,
      marginLeft: 4,
      flex: 1,
    },
    descriptionText: {
      fontSize: 12,
      color: SwissColors.textSecondary,
      lineHeight: 16,
      marginBottom: 8,
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    statusText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '600',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#000',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 100,
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      marginTop: 16,
    },
    emptyText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginTop: 8,
    },
    exploreButton: {
      marginTop: 24,
      backgroundColor: SwissColors.swissRed,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    exploreButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    textDark: {
      color: '#fff',
    },
    textSecondaryDark: {
      color: '#888',
    },
  });
