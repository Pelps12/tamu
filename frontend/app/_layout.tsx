import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts, ChangaOne_400Regular } from '@expo-google-fonts/changa-one';

import { useColorScheme } from '@/components/useColorScheme';
import Header from '@/components/Header';
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { RKProvider } from '@/providers/RKProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'signin',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ChangaOne_400Regular,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <RKProvider>
    <ThemeProvider value={DefaultTheme}>
      <Stack>
      <Stack.Screen name="signin" options={{headerShown: false}} />
        <Stack.Screen name="seat_entry" options={{header: () => <Header/>}} />
        <Stack.Screen name="pickup" options={{header: () => <Header/>}} />
        <Stack.Screen name = "home" options={{header: () => <Header page='home'/>}}/>
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
    </RKProvider>
  );
}
