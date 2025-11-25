import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Departure {
  time: string;
  destination: string;
  category: string;
  number: string;
  platform: string;
}

export interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  status: string;
  rating: number;
  category: string;
  price?: number;
  schedule?: string;
  transportType?: string;
  departures?: Departure[];
}

interface DestinationsState {
  destinations: Destination[];
  selectedDestination: Destination | null;
  loading: boolean;
  error: string | null;
}

const initialState: DestinationsState = {
  destinations: [],
  selectedDestination: null,
  loading: false,
  error: null,
};

// Fetch destinations from Swiss Transport API
export const fetchDestinations = createAsyncThunk(
  'destinations/fetchAll',
  async (searchQuery: string = '', { rejectWithValue }) => {
    try {
      let swissStations: string[] = [];
      
      if (searchQuery && searchQuery.trim() !== '') {
        // Dynamic search - fetch stations matching user query
        const searchResponse = await axios.get(
          `https://transport.opendata.ch/v1/locations?query=${encodeURIComponent(searchQuery)}&type=station`
        );
        
        if (searchResponse.data.stations && searchResponse.data.stations.length > 0) {
          swissStations = searchResponse.data.stations.slice(0, 15).map((station: any) => station.name);
        } else {
          return rejectWithValue('No stations found');
        }
      } else {
        // Default: Fetch major Swiss cities when no search query
        swissStations = [
          'Zurich HB', 'Geneva', 'Basel SBB', 'Bern', 'Lausanne', 
          'Lucerne', 'Lugano', 'St. Gallen', 'Winterthur', 'Biel/Bienne',
          'Thun', 'Köniz', 'La Chaux-de-Fonds', 'Schaffhausen', 'Fribourg'
        ];
      }
      
      // Swiss station-specific images - using suitable Swiss train and station images
      const swissStationImages: { [key: string]: string } = {
        'Zurich HB': 'https://images.unsplash.com/photo-1604212399401-5fd807a65e18?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRyYWluJTIwc3RhdGlvbnxlbnwwfHwwfHx8MA%3D%3D', // Railway station
        'Zurich': 'https://images.unsplash.com/photo-1604212399401-5fd807a65e18?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRyYWluJTIwc3RhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
        'Geneva': 'https://images.unsplash.com/photo-1660810535332-7ecba72ed873?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8', // Geneva cityscape
        'Basel SBB': 'https://images.unsplash.com/photo-1527839321757-ad3a2f2be351?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhaW4lMjBzdGF0aW9ufGVufDB8fDB8fHww', // City architecture
        'Basel': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        'Bern': 'https://images.unsplash.com/photo-1527295110-5145f6b148d0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8enVnfGVufDB8fDB8fHww', // Urban landscape
        'Lausanne': 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=800&h=600&fit=crop', // Modern city
        'Lucerne': 'https://images.unsplash.com/photo-1514970746-d4a465d514d0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3dpc3MlMjB0cmFpbnxlbnwwfHwwfHx8MA%3D%3D', // Swiss city view
        'Lugano': 'https://images.unsplash.com/photo-1572041341933-57caa3b8f6d5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3dpc3MlMjB0cmFpbnxlbnwwfHwwfHx8MA%3D%3D', // Scenic landscape
        'St. Gallen': 'https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800&h=600&fit=crop', // Mountain view
        'Winterthur': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop', // Urban setting
        'Biel/Bienne': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop', // Lake view
        'Thun': 'https://images.unsplash.com/photo-1622670719955-4e1c43db73ef?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJhaW5zdGF0aW9ufGVufDB8fDB8fHww', // Mountain landscape
        'Köniz': 'https://images.unsplash.com/photo-1593186344142-ef775a6e596f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3dpc3MlMjB0cmFpbnxlbnwwfHwwfHx8MA%3D%3D', // Swiss nature
        'La Chaux-de-Fonds': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', // Mountain peak
        'Schaffhausen': 'https://images.unsplash.com/photo-1563196314-2f7f1facf557?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHN3aXR6ZXJsYW5kJTIwdHJhaW58ZW58MHx8MHx8fDA%3D', // Natural landscape
        'Fribourg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Alpine scenery
        'Interlaken': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', // Lake and mountains
        'Zermatt': 'https://images.unsplash.com/photo-1574499307074-f9a427d03a45?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHN3aXR6ZXJsYW5kJTIwdHJhaW58ZW58MHx8MHx8fDA%3D', // Mountain vista
        'Montreux': 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=600&fit=crop', // Lakeside view
        'Grindelwald': 'https://images.unsplash.com/photo-1572803090936-72796aef96a2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3dpdHplcmxhbmQlMjB0cmFpbnxlbnwwfHwwfHx8MA%3D%3D', // Alpine peaks
        'Davos': 'https://images.unsplash.com/photo-1672498821497-deee7c266a69?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3dpc3MlMjB0cmFpbnxlbnwwfHwwfHx8MA%3D%3D', // Mountain scenery
        'Locarno': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', // Lake setting
      };
      
      const destinationsPromises = swissStations.map(async (station, index) => {
        try {
          // Get location data for the station
          const locationResponse = await axios.get(
            `https://transport.opendata.ch/v1/locations?query=${encodeURIComponent(station)}&type=station`
          );
          
          if (!locationResponse.data.stations || locationResponse.data.stations.length === 0) {
            throw new Error('Station not found');
          }
          
          const stationData = locationResponse.data.stations[0];
          
          // Get stationboard (departures) from this station - fetch more trains
          const stationboardResponse = await axios.get(
            `https://transport.opendata.ch/v1/stationboard?station=${encodeURIComponent(station)}&limit=40`
          );
          const stationboard = stationboardResponse.data.stationboard || [];
          
          // Extract schedule times and full departure information
          let schedule = '08:00, 10:00, 14:00, 18:00, 20:00, 22:00'; // Default fallback
          let departures: Departure[] = [];
          
          if (stationboard.length > 0) {
            schedule = stationboard.map((departure: any) => {
              const time = new Date(departure.stop.departure);
              return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
            }).join(', ');
            
            // Store full departure information
            departures = stationboard.map((departure: any) => {
              const time = new Date(departure.stop.departure);
              return {
                time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
                destination: departure.to || 'Unknown',
                category: departure.category || 'Train',
                number: departure.number || '',
                platform: departure.stop.platform || 'N/A',
              };
            });
          }
          
          // Determine transport type from stationboard
          let transportType = 'Train';
          if (stationboard.length > 0 && stationboard[0].category) {
            const category = stationboard[0].category.toUpperCase();
            
            // Swiss train categories
            if (category.includes('IC') || category.includes('IR') || category.includes('ICE') || category.includes('EC')) {
              transportType = 'Express';
            } else if (category === 'R' || category.includes('RE')) {
              transportType = 'Regional';
            } else if (category.startsWith('S')) {
              transportType = 'S-Bahn';
            } else if (category.includes('BUS')) {
              transportType = 'Bus';
            } else if (category.includes('T') || category.includes('TRAM')) {
              transportType = 'Tram';
            } else if (category.includes('BAT') || category.includes('SHIP')) {
              transportType = 'Boat';
            } else {
              transportType = category; // Use the actual category name for others
            }
          }
          
          // Generate description based on station
          const descriptions = [
            `Major transport hub connecting all of Switzerland with frequent ${transportType} services.`,
            `Beautiful station offering scenic routes throughout the Swiss Alps.`,
            `Modern transport center with connections to major European cities.`,
            `Historic station serving as gateway to stunning mountain destinations.`,
            `Central hub providing excellent connectivity across Switzerland.`,
          ];
          
          // Format location
          let location = 'Switzerland';
          if (stationData.coordinate?.x && stationData.coordinate?.y) {
            // Use icon coordinates for display (only show if available)
            location = `${stationData.coordinate.y.toFixed(4)}°N, ${stationData.coordinate.x.toFixed(4)}°E`;
          }
          // Better approach: use station name or city
          const cityMatch = station.match(/^([^,]+)/);
          if (cityMatch) {
            location = `${cityMatch[1]}, Switzerland`;
          }
          
          return {
            id: index + 1,
            name: stationData.name || station,
            description: descriptions[index % descriptions.length],
            image: swissStationImages[station] || 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop',
            location: location,
            status: 'Operating',
            rating: 4.0 + (Math.random() * 1),
            category: 'Transport',
            price: 15 + (index * 5),
            schedule: schedule,
            transportType: transportType,
            departures: departures,
          };
        } catch (error) {
          // Fallback data if API call fails for this station
          const fallbackDepartures: Departure[] = [
            { time: '08:00', destination: 'Unknown', category: 'Train', number: '', platform: 'N/A' },
            { time: '10:00', destination: 'Unknown', category: 'Train', number: '', platform: 'N/A' },
            { time: '14:00', destination: 'Unknown', category: 'Train', number: '', platform: 'N/A' },
            { time: '18:00', destination: 'Unknown', category: 'Train', number: '', platform: 'N/A' },
          ];
          
          return {
            id: index + 1,
            name: station,
            description: `Transport hub in ${station}, Switzerland with regular services.`,
            image: swissStationImages[station] || 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop',
            location: 'Switzerland',
            status: 'Operating',
            rating: 4.2,
            category: 'Transport',
            price: 15 + (index * 5),
            schedule: '08:00, 10:00, 14:00, 18:00',
            transportType: 'Train',
            departures: fallbackDepartures,
          };
        }
      });
      
      const destinations = await Promise.all(destinationsPromises);
      return destinations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch destinations');
    }
  }
);

// Fetch single destination by ID with fresh real-time data from current time to end of day
export const fetchDestinationById = createAsyncThunk(
  'destinations/fetchById',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      // Find the station from already loaded destinations
      const state: any = getState();
      const existingDestination = state.destinations.destinations.find((d: Destination) => d.id === id);
      
      if (!existingDestination) {
        throw new Error('Destination not found');
      }
      
      // Fetch fresh real-time departure data from current time to end of day
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const stationboardResponse = await axios.get(
        `https://transport.opendata.ch/v1/stationboard?station=${encodeURIComponent(existingDestination.name)}&limit=100`
      );
      const stationboard = stationboardResponse.data.stationboard || [];
      
      // Filter departures from current time to end of day
      let departures: Departure[] = stationboard
        .filter((departure: any) => {
          if (!departure.stop || !departure.stop.departure) return false;
          const departureTime = new Date(departure.stop.departure);
          // Check if date is valid and is today and after current time
          const isValidDate = !isNaN(departureTime.getTime());
          const isSameDay = departureTime.toDateString() === now.toDateString();
          const isAfterNow = departureTime.getTime() >= now.getTime();
          return isValidDate && isSameDay && isAfterNow;
        })
        .map((departure: any) => {
          const time = new Date(departure.stop.departure);
          return {
            time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
            destination: departure.to || 'Unknown',
            category: departure.category || 'Train',
            number: departure.number || '',
            platform: departure.stop.platform || 'N/A',
          };
        });
      
      // If no departures left today, use existing departures or show all available
      if (departures.length === 0) {
        if (existingDestination.departures && existingDestination.departures.length > 0) {
          departures = existingDestination.departures;
        } else if (stationboard.length > 0) {
          // Show all available departures regardless of time
          departures = stationboard.slice(0, 40).map((departure: any) => {
            const time = new Date(departure.stop.departure);
            return {
              time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
              destination: departure.to || 'Unknown',
              category: departure.category || 'Train',
              number: departure.number || '',
              platform: departure.stop.platform || 'N/A',
            };
          });
        }
      }
      
      // Update schedule string with filtered times
      const schedule = departures.length > 0
        ? departures.map(d => d.time).join(', ')
        : existingDestination.schedule;
      
      return {
        ...existingDestination,
        schedule,
        departures,
      };
    } catch (error: any) {
      // If fresh fetch fails, try to return existing destination with its departures
      const state: any = getState();
      const existingDestination = state.destinations.destinations.find((d: Destination) => d.id === id);
      
      if (existingDestination && existingDestination.departures) {
        // Return the existing destination with whatever departures it has
        return existingDestination;
      }
      
      // Last resort: return error
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch destination');
    }
  }
);

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    setSelectedDestination: (state, action: PayloadAction<Destination>) => {
      state.selectedDestination = action.payload;
    },
    clearSelectedDestination: (state) => {
      state.selectedDestination = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all destinations
    builder.addCase(fetchDestinations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDestinations.fulfilled, (state, action: PayloadAction<Destination[]>) => {
      state.loading = false;
      state.destinations = action.payload;
      state.error = null;
    });
    builder.addCase(fetchDestinations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch single destination
    builder.addCase(fetchDestinationById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDestinationById.fulfilled, (state, action: PayloadAction<Destination>) => {
      state.loading = false;
      state.selectedDestination = action.payload;
      state.error = null;
    });
    builder.addCase(fetchDestinationById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedDestination, clearSelectedDestination } = destinationsSlice.actions;
export default destinationsSlice.reducer;
