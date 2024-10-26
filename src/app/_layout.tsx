import { StatusBar } from 'expo-status-bar'; // Updated import
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Platform, TouchableOpacity } from 'react-native';
import { translate } from '@/app/services/translate';
import { FilterActivityInputProvider } from '@/context/FilterActivityInputContext';
import * as NavigationBar from 'expo-navigation-bar'; // Import NavigationBar
import { initI18next } from '@/app/services/i18next';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    mon: require('../../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../../assets/fonts/Montserrat-Bold.ttf'),
  });

  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for i18next to initialize
        await initI18next;
        setI18nInitialized(true);
      } catch (e) {
        console.error('Error initializing i18next:', e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded && i18nInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nInitialized]);

  // Set the navigation bar appearance (Android only)
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(Colors.background); // White background
    NavigationBar.setButtonStyleAsync('dark'); // Dark icons
  }, []);

  if (!fontsLoaded || !i18nInitialized) {
    return null; // TODO render a loading indicator
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <FilterActivityInputProvider>
        {/* Status Bar Configuration */}
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <RootLayoutNav />
      </FilterActivityInputProvider>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();

  // Automatically open login if user is not authenticated
  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     router.push('/(modals)/login');
  //   }
  // }, [isLoaded]);

  useEffect(() => {
    const saveTokenToSecureStore = async () => {
      if (isLoaded) {
        const token = await getToken();
        if (token) {
          await SecureStore.setItemAsync('clerk-token', token);
        } else {
          await SecureStore.deleteItemAsync('clerk-token');
        }
      }
    };
    saveTokenToSecureStore();
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <Stack
      screenOptions={{
        animation: 'ios',
        // Conditionally apply styles for iOS
        ...(Platform.OS === 'ios' && {
          headerBackTitleVisible: false, // Hides the back button text
          headerTintColor: 'black', // Changes the back button color to black
        }),
      }}
    >
      <Stack.Screen
        name="(modals)/user/login"
        options={{
          presentation: 'modal',
          title: translate('login_modal.header'),
          headerTitleStyle: {
            fontFamily: 'mon-sb',
          },
          headerLeft: () =>
            Platform.OS === 'android' ? (
              <TouchableOpacity onPress={() => router.push(`/(tabs)`)}>
                <Ionicons name="close-outline" size={28} />
              </TouchableOpacity>
            ) : null,
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="oauth-native-callback" options={{ headerShown: false }} />
      <Stack.Screen name="activity/[id]" options={{ headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name="user/[id]" options={{ headerTitle: '', headerTransparent: true }} />
      <Stack.Screen
        name="(modals)/activities-filter"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerTransparent: true,
          title: translate('explorer_screen.activities-filter.title'),
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: '#fff',
                borderColor: Colors.grey,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
              }}
            >
              <Ionicons name="close-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
