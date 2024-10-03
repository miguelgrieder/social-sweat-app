import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import { translate } from '@/app/services/translate';
import { FilterActivityInputProvider } from '@/context/FilterActivityInputContext';

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
  const [loaded, error] = useFonts({
    mon: require('../../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../../assets/fonts/Montserrat-Bold.ttf'),
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

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <FilterActivityInputProvider>
        <StatusBar barStyle="dark-content" />
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push(`/(tabs)`)}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="activity/[id]" options={{ headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name="user/[id]" options={{ headerTitle: '', headerTransparent: true }} />
      <Stack.Screen
        name="(modals)/activities-filter"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerTransparent: true,
          headerTitle: 'Filters',
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
