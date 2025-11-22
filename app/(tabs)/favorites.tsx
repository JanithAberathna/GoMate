import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { Destination } from '@/store/slices/destinationsSlice';

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
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isDarkMode && styles.textDark]} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => handleRemoveFavorite(item)}>
            <Feather name="heart" size={24} color="#ff3b30" />
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
      backgroundColor: isDarkMode ? '#000' : '#f5f5f5',
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#222' : '#e5e5e5',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
    },
    count: {
      fontSize: 14,
      color: isDarkMode ? '#888' : '#666',
      marginTop: 4,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      flexDirection: 'row',
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
      width: 120,
      height: '100%',
      backgroundColor: isDarkMode ? '#222' : '#f0f0f0',
    },
    cardContent: {
      flex: 1,
      padding: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      flex: 1,
      marginRight: 8,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    locationText: {
      fontSize: 12,
      color: '#666',
      marginLeft: 4,
      flex: 1,
    },
    descriptionText: {
      fontSize: 12,
      color: '#666',
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
      backgroundColor: '#007AFF',
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
