import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDarkMode: boolean;
}

const initialState: ThemeState = {
  isDarkMode: false,
};

const THEME_STORAGE_KEY = 'gomate_theme';

// Load theme preference
export const loadTheme = createAsyncThunk(
  'theme/load',
  async () => {
    try {
      const theme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return theme === 'dark';
    } catch (error) {
      console.error('Failed to load theme:', error);
      return false;
    }
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      AsyncStorage.setItem(THEME_STORAGE_KEY, state.isDarkMode ? 'dark' : 'light');
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
      AsyncStorage.setItem(THEME_STORAGE_KEY, action.payload ? 'dark' : 'light');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTheme.fulfilled, (state, action) => {
      state.isDarkMode = action.payload;
    });
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
