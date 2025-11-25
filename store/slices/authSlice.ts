import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for login using DummyJSON API
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      // Call DummyJSON authentication API
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });
      
      // Extract user data from response
      const userData = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        token: response.data.accessToken,
      };
      
      // Store user data
      await AsyncStorage.setItem('userToken', userData.token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      return userData;
    } catch (error: any) {
      if (error.response?.status === 400) {
        return rejectWithValue('Invalid credentials. Try username: "emilys" and password: "emilyspass"');
      }
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for registration - accepts any user data
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { firstName: string; lastName: string; username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // Create mock user data directly (skip API call for easier registration)
      const mockUserData = {
        id: Math.floor(Math.random() * 1000),
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        token: 'mock-token-' + Date.now(),
      };
      
      // Store user data
      await AsyncStorage.setItem('userToken', mockUserData.token);
      await AsyncStorage.setItem('userData', JSON.stringify(mockUserData));
      
      return mockUserData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Restore session
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userDataString = await AsyncStorage.getItem('userData');
      
      if (token && userDataString) {
        const userData = JSON.parse(userDataString);
        return userData;
      }
      
      return rejectWithValue('No session found');
    } catch (error) {
      return rejectWithValue('Failed to restore session');
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Restore session
    builder.addCase(restoreSession.fulfilled, (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(restoreSession.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
