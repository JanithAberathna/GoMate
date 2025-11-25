import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { SwissColors } from '@/constants/theme';
import axios from 'axios';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Connection {
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  platform: string;
  transfers: number;
  trainType: string;
  trainNumber: string;
}

// Helper function to get full train type name
const getTrainTypeName = (category: string): string => {
  const trainTypes: { [key: string]: string } = {
    'IC': 'InterCity',
    'IR': 'InterRegio',
    'ICE': 'InterCity Express',
    'EC': 'EuroCity',
    'RE': 'Regional Express',
    'R': 'Regional',
    'S': 'S-Bahn (Suburban)',
    'TGV': 'Train à Grande Vitesse',
    'RJ': 'RailJet',
    'EN': 'EuroNight',
    'BUS': 'Bus',
    'T': 'Tram',
    'BAT': 'Boat',
  };
  
  // Check if category starts with any known prefix
  for (const [key, value] of Object.entries(trainTypes)) {
    if (category.toUpperCase().startsWith(key)) {
      return value;
    }
  }
  
  return category; // Return original if not found
};

// Helper function to parse train type and show full names
const formatTrainTypeWithNames = (trainType: string): { display: string; fullNames: string } => {
  const parts = trainType.split(' → ');
  const fullNames = parts.map(part => {
    const match = part.match(/^([A-Z]+)/);
    if (match) {
      return getTrainTypeName(match[1]);
    }
    return '';
  }).filter(name => name).join(' → ');
  
  return {
    display: trainType,
    fullNames: fullNames
  };
};

export default function JourneyPlanScreen() {
  const router = useRouter();
  const isDarkMode = useAppSelector((state: any) => state.theme.isDarkMode);
  
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDuration = (duration: string): string => {
    // Duration comes in format like "00d01:23:45" (days:hours:minutes:seconds)
    const match = duration.match(/(\d+)d(\d+):(\d+):(\d+)/);
    if (match) {
      const days = parseInt(match[1], 10);
      const hours = parseInt(match[2], 10) + (days * 24);
      const minutes = match[3];
      const seconds = match[4];
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    
    // If no days, format is "HH:MM:SS"
    const timeMatch = duration.match(/(\d+):(\d+):(\d+)/);
    if (timeMatch) {
      const hours = timeMatch[1];
      const minutes = timeMatch[2];
      const seconds = timeMatch[3];
      return `${parseInt(hours)}h ${minutes}m ${seconds}s`;
    }
    
    return duration;
  };

  const searchConnections = async () => {
    if (!fromStation || !toStation) {
      setError('Please enter both departure and destination stations');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(
        `https://transport.opendata.ch/v1/connections?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}&limit=10`
      );

      if (response.data.connections && response.data.connections.length > 0) {
        const formattedConnections = response.data.connections.map((conn: any) => {
          const departure = new Date(conn.from.departure);
          const arrival = new Date(conn.to.arrival);
          
          // Get all train types from all sections
          let trainType = 'Train';
          let trainNumber = '';
          if (conn.sections && conn.sections.length > 0) {
            // Collect all train types in the journey
            const trainTypes = conn.sections
              .filter((section: any) => section.journey) // Only sections with trains
              .map((section: any) => {
                const category = section.journey.category || '';
                const number = section.journey.number || '';
                return number ? `${category} ${number}` : category;
              })
              .filter((type: string) => type); // Remove empty strings
            
            if (trainTypes.length > 0) {
              trainType = trainTypes.join(' → ');
              trainNumber = '';
            }
          }
          
          return {
            from: conn.from.station.name,
            to: conn.to.station.name,
            departure: `${departure.getHours().toString().padStart(2, '0')}:${departure.getMinutes().toString().padStart(2, '0')}`,
            arrival: `${arrival.getHours().toString().padStart(2, '0')}:${arrival.getMinutes().toString().padStart(2, '0')}`,
            duration: formatDuration(conn.duration || 'N/A'),
            platform: conn.from.platform || 'N/A',
            transfers: conn.transfers || 0,
            trainType: trainType,
            trainNumber: trainNumber,
          };
        });
        
        setConnections(formattedConnections);
      } else {
        setError('No connections found between these stations');
        setConnections([]);
      }
    } catch (err) {
      setError('Failed to find connections. Please check station names.');
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={isDarkMode ? '#fff' : SwissColors.neutralCharcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journey Planner</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchCard}>
          <View style={styles.inputContainer}>
            <Feather name="circle" size={12} color={SwissColors.alpineGreen} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="From (e.g., Zurich HB)"
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
              value={fromStation}
              onChangeText={setFromStation}
            />
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapStations}>
            <Feather name="refresh-cw" size={20} color={SwissColors.swissRed} />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Feather name="map-pin" size={12} color={SwissColors.swissRed} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="To (e.g., Geneva)"
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
              value={toStation}
              onChangeText={setToStation}
            />
          </View>

          <TouchableOpacity 
            style={styles.searchButton}
            onPress={searchConnections}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="search" size={20} color="#fff" />
                <Text style={styles.searchButtonText}>Search</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={48} color={SwissColors.swissRed} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {connections.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {connections.length} Connections Found
            </Text>
            
            {connections.map((connection, index) => {
              const trainInfo = formatTrainTypeWithNames(connection.trainType);
              return (
              <View key={index} style={styles.connectionCard}>
                <View style={styles.trainTypeHeader}>
                  <View style={styles.trainTypeBadge}>
                    <Feather name="navigation" size={14} color={SwissColors.swissRed} />
                    <View>
                      <Text style={styles.trainTypeText}>
                        {trainInfo.display}
                      </Text>
                      {trainInfo.fullNames && (
                        <Text style={styles.trainTypeFullName}>
                          {trainInfo.fullNames}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                
                <View style={styles.connectionHeader}>
                  <View style={styles.timeSection}>
                    <Text style={styles.departureTime}>{connection.departure}</Text>
                    <View style={styles.durationContainer}>
                      <View style={styles.durationLine} />
                      <Text style={styles.durationText}>{connection.duration}</Text>
                    </View>
                    <Text style={styles.arrivalTime}>{connection.arrival}</Text>
                  </View>
                  
                  <View style={styles.detailsSection}>
                    <View style={styles.stationInfo}>
                      <Text style={styles.stationName} numberOfLines={1}>{connection.from}</Text>
                      <Text style={styles.platformText}>Platform {connection.platform}</Text>
                    </View>
                    
                    {connection.transfers > 0 && (
                      <View style={styles.transfersBadge}>
                        <Feather name="refresh-cw" size={12} color={SwissColors.cautionYellow} />
                        <Text style={styles.transfersText}>{connection.transfers} transfer{connection.transfers > 1 ? 's' : ''}</Text>
                      </View>
                    )}
                    
                    <View style={styles.stationInfo}>
                      <Text style={styles.stationName} numberOfLines={1}>{connection.to}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
            })}
          </View>
        )}
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#222' : '#f0f0f0',
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    searchCard: {
      backgroundColor: isDarkMode ? '#1C1C1C' : '#fff',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0 : 0.1,
      shadowRadius: 12,
      elevation: 4,
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#000' : SwissColors.swissWhite,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#e0e0e0',
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    swapButton: {
      alignSelf: 'center',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDarkMode ? '#000' : SwissColors.swissWhite,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8,
      borderWidth: 2,
      borderColor: SwissColors.swissRed,
    },
    searchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: SwissColors.swissRed,
      borderRadius: 12,
      paddingVertical: 16,
      marginTop: 8,
      gap: 8,
    },
    searchButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
    errorContainer: {
      alignItems: 'center',
      padding: 40,
    },
    errorText: {
      fontSize: 16,
      color: SwissColors.swissRed,
      textAlign: 'center',
      marginTop: 16,
    },
    resultsSection: {
      marginTop: 8,
    },
    resultsTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
      marginBottom: 16,
    },
    connectionCard: {
      backgroundColor: isDarkMode ? '#1C1C1C' : '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    trainTypeHeader: {
      marginBottom: 12,
    },
    trainTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: SwissColors.swissRed + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    trainTypeText: {
      fontSize: 13,
      fontWeight: '700',
      color: SwissColors.swissRed,
      letterSpacing: 0.3,
    },
    trainTypeFullName: {
      fontSize: 10,
      fontWeight: '500',
      color: isDarkMode ? '#888' : '#666',
      marginTop: 2,
      fontStyle: 'italic',
    },
    connectionHeader: {
      flexDirection: 'row',
      gap: 16,
    },
    timeSection: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    departureTime: {
      fontSize: 20,
      fontWeight: '800',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
    },
    arrivalTime: {
      fontSize: 20,
      fontWeight: '800',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
    },
    durationContainer: {
      alignItems: 'center',
      paddingVertical: 8,
    },
    durationLine: {
      width: 2,
      height: 30,
      backgroundColor: SwissColors.steelGray,
      marginBottom: 4,
    },
    durationText: {
      fontSize: 12,
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
      fontWeight: '600',
    },
    detailsSection: {
      flex: 1,
      justifyContent: 'space-between',
    },
    stationInfo: {
      flex: 1,
    },
    stationName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : SwissColors.neutralCharcoal,
      marginBottom: 4,
    },
    platformText: {
      fontSize: 12,
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
    },
    transfersBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
    },
    transfersText: {
      fontSize: 12,
      color: isDarkMode ? '#888' : SwissColors.textSecondary,
      fontWeight: '600',
    },
  });
