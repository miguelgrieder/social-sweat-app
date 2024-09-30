import * as SecureStore from 'expo-secure-store';

export const getUserToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync('clerk-token');
    return token;
  } catch (error) {
    console.error('Error getting token from SecureStore:', error);
    return null;
  }
};
