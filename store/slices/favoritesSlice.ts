import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Destination } from './destinationsSlice';

interface FavoritesState {
  favorites: Destination[];
  loading: boolean;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
};

const FAVORITES_STORAGE_KEY = 'gomate_favorites';

// Load favorites from storage
export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favoritesJson) {
        return JSON.parse(favoritesJson) as Destination[];
      }
      return [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  }
);

// Save favorites to storage
const saveFavoritesToStorage = async (favorites: Destination[]) => {
  try {
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Destination>) => {
      const exists = state.favorites.find(fav => fav.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
        saveFavoritesToStorage(state.favorites);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
      saveFavoritesToStorage(state.favorites);
    },
    toggleFavorite: (state, action: PayloadAction<Destination>) => {
      const index = state.favorites.findIndex(fav => fav.id === action.payload.id);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
      saveFavoritesToStorage(state.favorites);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFavorites.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadFavorites.fulfilled, (state, action: PayloadAction<Destination[]>) => {
      state.loading = false;
      state.favorites = action.payload;
    });
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
