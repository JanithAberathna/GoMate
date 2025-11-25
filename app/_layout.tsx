import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { restoreSession } from '@/store/slices/authSlice';
import { loadFavorites } from '@/store/slices/favoritesSlice';
import { loadTheme } from '@/store/slices/themeSlice';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state: any) => state.theme.isDarkMode);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Load persisted data
    dispatch(restoreSession());
    dispatch(loadFavorites());
    dispatch(loadTheme());
  }, []);

  useEffect(() => {
    // Don't navigate until the navigation state is ready
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === 'auth';

    // Add a small delay to ensure everything is mounted
    const timeout = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to login if not authenticated
        router.replace('/auth/login');
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to tabs if authenticated
        router.replace('/(tabs)');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, segments, navigationState?.key]);

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="journey/plan" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
