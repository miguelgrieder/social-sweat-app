import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { translate } from '@/app/services/translate';
import { fetchUsers } from '@/api/fetchUsers';
import { User } from '@/interfaces/user';
import { capitalize } from '@/utils/utils';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { spacing } from '@/constants/spacing';
import SportTag from '@/components/SportTag';
import NotLoggedInMessage from '@/components/NotLoggedInMessage';
import SocialMediaButtons from '@/components/user/SocialMediaButtons';
import HorizontalCards from '@/components/user/HorizontalCards';
import Loading from '@/components/Loading';

interface ProfilePageProps {
  profileUserId?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profileUserId }) => {
  const { isLoaded: isUserLoaded, isSignedIn, user: authUser } = useUser();
  const { isLoaded: isAuthLoaded, userId: currentUserId, signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserData = useCallback(async () => {
    if (loading || !isAuthLoaded) {
      return <Loading />;
    }

    const idToFetch = profileUserId || currentUserId;

    if (!idToFetch) {
      setUser(null);
      setIsCurrentUser(false);
      return;
    }

    setIsCurrentUser(currentUserId ? idToFetch === currentUserId : false);

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
  }, [profileUserId, currentUserId, isUserLoaded, isAuthLoaded]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  if (!user) {
    return (
      <SafeAreaView style={defaultStyles.container}>
        {!isSignedIn ? <NotLoggedInMessage addLink={true} /> : <Loading />}
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
        <Text style={styles.userRole}>
          {capitalize(translate(`role_selection.role_${user.user_metadata.role}`))}
        </Text>

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
              <SportTag key={index} sport={sport} />
            ))}
          </View>
        )}

        {/* Social Media Buttons */}
        {user.user_metadata.user_social_medias && (
          <SocialMediaButtons socialMedias={user.user_metadata.user_social_medias} />
        )}

        {/* Profile Description */}
        {user.user_metadata.profile_description && (
          <Text style={styles.profileDescription}>{user.user_metadata.profile_description}</Text>
        )}

        {/* Horizontal Cards */}
        {user.user_metadata.user_metrics && (
          <HorizontalCards userMetrics={user.user_metadata.user_metrics} />
        )}
      </ScrollView>

      {/* Logout / Login Button */}
      {isCurrentUser && (
        <>
          {isSignedIn ? (
            <TouchableOpacity
              style={[defaultStyles.btn, { margin: spacing.xs }]}
              onPress={() => {
                signOut();
                setUser(null); // Reset the user state upon sign out
              }}
            >
              <Text style={defaultStyles.btnText}>{translate('common.logout')}</Text>
            </TouchableOpacity>
          ) : (
            <></>
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
  profileDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});
