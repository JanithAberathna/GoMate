import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
  async (_, { rejectWithValue }) => {
    try {
      // Using Swiss Transport API for real travel data in Switzerland
      const swissStations = [
        'Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 
        'Lucerne', 'Lugano', 'St. Gallen', 'Interlaken', 'Zermatt',
        'Montreux', 'Grindelwald', 'Davos', 'Locarno', 'Thun'
      ];
      
      // Swiss station-specific images - using reliable Swiss transport and landscape images
      const swissStationImages: { [key: string]: string } = {
        'Zurich': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop', // Zurich train station
        'Geneva': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop', // Lake view
        'Basel': 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop', // Train station
        'Bern': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountains
        'Lausanne': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Swiss landscape
        'Lucerne': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop', // City and lake
        'Lugano': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain lake
        'St. Gallen': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', // Swiss train
        'Interlaken': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Alpine view
        'Zermatt': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain peak
        'Montreux': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop', // Lakeside
        'Grindelwald': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Alps
        'Davos': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain resort
        'Locarno': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop', // Lake and mountains
        'Thun': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop', // Lake Thun view
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
          
          // Get connections/schedule from this station
          const connectionsResponse = await axios.get(
            `https://transport.opendata.ch/v1/connections?from=${encodeURIComponent(station)}&limit=5`
          );
          const connections = connectionsResponse.data.connections || [];
          
          // Extract schedule times
          const schedule = connections.slice(0, 4).map((conn: any) => {
            const time = new Date(conn.from.departure);
            return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
          }).join(', ') || '08:00, 10:00, 14:00, 18:00';
          
          // Determine transport type
          let transportType = 'Train';
          if (connections[0]?.products) {
            const products = connections[0].products;
            if (products.includes('IR') || products.includes('IC') || products.includes('ICE')) {
              transportType = 'Train';
            } else if (products.includes('S')) {
              transportType = 'S-Bahn';
            } else if (products.includes('Bus') || products.includes('BUS')) {
              transportType = 'Bus';
            } else if (products.includes('T')) {
              transportType = 'Tram';
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
          
          return {
            id: index + 1,
            name: stationData.name || station,
            description: descriptions[index % descriptions.length],
            image: swissStationImages[station] || 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop',
            location: `${stationData.coordinate?.x || ''}, ${stationData.coordinate?.y || ''}`.trim() || 'Switzerland',
            status: 'Operating',
            rating: 4.0 + (Math.random() * 1),
            category: 'Transport',
            price: 15 + (index * 5),
            schedule: schedule,
            transportType: transportType,
          };
        } catch (error) {
          // Fallback data if API call fails for this station
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

// Fetch single destination by ID
export const fetchDestinationById = createAsyncThunk(
  'destinations/fetchById',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      // Try to find in already loaded destinations first
      const state: any = getState();
      const existingDestination = state.destinations.destinations.find((d: Destination) => d.id === id);
      
      if (existingDestination) {
        return existingDestination;
      }
      
      // If not found, return a placeholder (since we're using static list)
      const destination: Destination = {
        id: id,
        name: 'Swiss Station',
        description: 'Major transport hub in Switzerland',
        image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop',
        location: 'Switzerland',
        status: 'Operating',
        rating: 4.5,
        category: 'Transport',
        price: 25,
        schedule: '08:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00, 22:00',
        transportType: 'Train',
      };
      
      return destination;
    } catch (error: any) {
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
