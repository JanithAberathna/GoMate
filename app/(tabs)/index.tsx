import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';

export default function IndexRedirect() {
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Wait for navigation state to be ready
    if (!navigationState?.key) return;
    
    // Add a small delay to ensure everything is mounted
    const timeout = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 100);

    return () => clearTimeout(timeout);
  }, [navigationState?.key]);

  return null;
}
