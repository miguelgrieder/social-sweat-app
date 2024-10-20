import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useOAuth, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { defaultStyles } from '@/constants/Styles';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';
import { fetchUsers } from '@/api/fetchUsers';

enum Strategy {
  Google = 'oauth_google',
  Apple = 'oauth_apple',
  Facebook = 'oauth_facebook',
}

const Page = () => {
  useWarmUpBrowser();

  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const { userId, isLoaded } = useAuth(); // Get userId and isLoaded from useAuth
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State to track if login is in progress

  // Effect to check user role after login
  useEffect(() => {
    const checkUserRole = async () => {
      if (isLoggingIn && isLoaded && userId) {
        try {
          const fetchedUsers = await fetchUsers({ id: userId });
          if (fetchedUsers && fetchedUsers.length > 0) {
            const user = fetchedUsers[0];
            if (user.user_metadata.role) {
              // User has a role, navigate to main page
              router.navigate('/(tabs)/');
            } else {
              // User doesn't have a role, navigate to role selection
              router.push('/(modals)/user/role-selection');
            }
          } else {
            // User not found, navigate to role selection
            router.push('/(modals)/user/role-selection');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/(modals)/user/role-selection');
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    checkUserRole();
  }, [isLoggingIn, isLoaded, userId]);

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        setIsLoggingIn(true); // Set login state to true to trigger useEffect
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder={translate('common.email')}
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />

      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>{translate('common.continue')}</Text>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View style={styles.line} />
        <Text style={styles.seperator}>{translate('common.or')}</Text>
        <View style={styles.line} />
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Google)}>
          <Ionicons name="logo-google" size={24} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>{translate('login_modal.continue_with')} Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
  },
  seperatorView: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  seperator: {
    fontFamily: 'mon-sb',
    color: Colors.grey,
    fontSize: 16,
  },
  line: {
    flex: 1,
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
});
