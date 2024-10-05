import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Button,
  ActivityIndicator,
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { translate } from '@/app/services/translate';
import { fetchUsers } from '@/api/fetchUsers';
import { User } from '@/interfaces/user';
import { capitalize } from '@/utils/utils';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { spacing } from '@/constants/spacing';

interface ProfilePageProps {
  profileUserId?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profileUserId }) => {
  const { isLoaded: isUserLoaded, isSignedIn, user: authUser } = useUser();
  const { isLoaded: isAuthLoaded, userId: currentUserId, signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isUserLoaded || !isAuthLoaded) {
      // Auth state is still loading
      return;
    }

    const idToFetch = profileUserId || currentUserId;

    if (!idToFetch) {
      setUser(null);
      setIsCurrentUser(false);
      return;
    }

    setIsCurrentUser(currentUserId ? idToFetch === currentUserId : false);

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await fetchUsers({ id: idToFetch });
        if (fetchedUsers && fetchedUsers.length > 0) {
          setUser(fetchedUsers[0]);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [profileUserId, currentUserId, isUserLoaded, isAuthLoaded, isSignedIn, authUser]);

  if (loading) {
    return (
      <SafeAreaView style={defaultStyles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={defaultStyles.container}>
        {!isSignedIn ? (
          <View style={styles.loginContainer}>
            <Text style={styles.loginPrompt}>{translate('common.not_logged_in')}</Text>
            <Link href={'/(modals)/user/login'} asChild>
              <TouchableOpacity style={defaultStyles.btn}>
                <Text style={defaultStyles.btnText}> {translate('common.login')} </Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <Text>{translate('common.loading')}</Text>
        )}
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(user.created_at).toLocaleDateString();

  return (
    <SafeAreaView style={defaultStyles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              user.image_url
                ? { uri: user.image_url }
                : require('assets/images/user_default_image.jpg')
            }
            style={styles.profileImage}
          />
        </View>

        {/* User Role */}
        <Text style={styles.userRole}>{capitalize(user.user_metadata.role)}</Text>

        {/* Name */}
        {user.first_name && (
          <Text style={styles.name}>
            {user.first_name} {user.last_name}
          </Text>
        )}

        {/* Username */}
        {user.username && <Text style={styles.username}>@{user.username}</Text>}

        {/* Since Date */}
        <Text style={styles.userSince}>
          {capitalize(translate('profile_screen.since'))} {formattedDate}
        </Text>

        {/* Sports List */}
        {user.user_metadata.sports && user.user_metadata.sports.length > 0 && (
          <View style={styles.sportsContainer}>
            {user.user_metadata.sports.map((sport, index) => (
              <View key={index} style={styles.sportBadge}>
                <Text style={styles.sportText}>
                  {translate(`activity_sports.${sport.toLowerCase()}`)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Social Media Buttons */}
        <View style={styles.socialMediaContainer}>
          {user.user_metadata.user_social_medias &&
            Object.entries(user.user_metadata.user_social_medias).map(([key, value]) => {
              if (value) {
                let baseUrl = '';
                let iconSource = null;
                switch (key) {
                  case 'user_youtube':
                    baseUrl = 'https://youtube.com/channel/';
                    iconSource = require('assets/images/user_default_image.jpg');
                    break;
                  case 'user_instagram':
                    baseUrl = 'https://instagram.com/';
                    iconSource = require('assets/images/user_default_image.jpg');
                    break;
                  case 'user_facebook':
                    baseUrl = 'https://facebook.com/';
                    iconSource = require('assets/images/user_default_image.jpg');
                    break;
                  case 'user_tiktok':
                    baseUrl = 'https://tiktok.com/@';
                    iconSource = require('assets/images/user_default_image.jpg');
                    break;
                  case 'user_strava':
                    baseUrl = 'https://www.strava.com/athletes/';
                    iconSource = require('assets/images/user_default_image.jpg');
                    break;
                  default:
                    break;
                }
                const url = baseUrl + value;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => Linking.openURL(url)}
                    style={styles.socialMediaButton}
                  >
                    <Image source={iconSource} style={styles.socialMediaIcon} />
                  </TouchableOpacity>
                );
              }
              return null;
            })}
        </View>

        {/* Profile Description */}
        {user.user_metadata.profile_description && (
          <Text style={styles.profileDescription}>{user.user_metadata.profile_description}</Text>
        )}

        {/* Horizontal Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {translate('profile_screen.activities_participated')}
            </Text>
            <Text style={styles.cardValue}>3</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {translate('profile_screen.activities_participated')}
            </Text>
            <Text style={styles.cardValue}>1</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {translate('profile_screen.activities_participated')}
            </Text>
            <Text style={styles.cardValue}>2</Text>
          </View>
        </View>
      </ScrollView>

      {/* Logout / Login Button */}
      {isCurrentUser && (
        <>
          {isSignedIn ? (
            <Button
              title={translate('common.logout')}
              onPress={() => {
                signOut();
                setUser(null); // Reset the user state upon sign out
              }}
              color={Colors.dark}
            />
          ) : (
            <Link href={'/(modals)/user/login'} asChild>
              <Button title={translate('common.login')} color={Colors.dark} />
            </Link>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.grey,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xxs,
  },
  userRole: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  username: {
    fontSize: 16,
    color: '#555',
    marginBottom: spacing.sm,
  },
  userSince: {
    fontSize: 14,
    color: '#666',
    marginBottom: spacing.lg,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  sportBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginTop: 4,
  },
  sportText: {
    fontSize: 12,
    color: '#555',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  socialMediaButton: {
    marginHorizontal: spacing.sm,
  },
  socialMediaIcon: {
    width: 40,
    height: 40,
  },
  profileDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: spacing.md,
    marginHorizontal: spacing.xxs,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loginPrompt: {
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
