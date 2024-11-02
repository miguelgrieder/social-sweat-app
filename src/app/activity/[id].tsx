import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Share,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';
import { Activity } from '@/interfaces/activity';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { fetchActivities } from '@/api/fetchActivities';
import { fetchUsers } from '@/api/fetchUsers';
import { User } from '@/interfaces/user';
import { useAuth } from '@clerk/clerk-expo';
import { userInteractActivity } from '@/api/userInteractActivity';
import { updateActivityState } from '@/api/activity/updateActivityState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { capitalize, formatDateTime, uppercaseAll } from '@/utils/utils';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const dummy_listing: Activity = {
  id: '',
  name: '',
  description: '',
  activity_type: '',
  sport_type: '',
  price: {
    value: 0,
    unit: '',
  },
  location: {
    country: '',
    area: '',
    city: '',
    smart_location: '',
    geometry: {
      type: 'Point',
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
  },
  participants: {
    participants_user_id: [],
    max: 1,
  },
  pictures: [],
  host: {
    host_user_id: '',
  },
  datetimes: {
    datetime_created: '',
    datetime_deleted: null,
    datetime_start: '',
    datetime_finish: '',
  },
  enabled: true,
};

const ActivityDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [activity, setActivity] = useState<Activity>(dummy_listing);
  const [hostUser, setHostUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const { userId } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getData = async () => {
      try {
        const filterBody = {
          activity_id: id,
        };
        const activities = await fetchActivities(filterBody);

        if (activities && activities.length > 0) {
          const activityData = activities[0];
          setActivity(activityData);

          // Fetch host user data
          const host_user_id = activityData.host.host_user_id;
          if (host_user_id) {
            const users = await fetchUsers({ id: host_user_id });
            if (users && users.length > 0) {
              setHostUser(users[0]);
            }
          }
        } else {
          console.warn('No activities found for the given ID.');
          setActivity(dummy_listing); // Provide default value
        }
      } catch (error) {
        console.error('Error fetching activity or host data:', error);
        setActivity(dummy_listing); // Provide default value on error
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const shareActivity = async () => {
    try {
      const message = `${translate('activity_screen.share')}: ${activity.name}`;
      const imageUrl = activity.pictures[0] || '';

      // Combine message and image URL
      const shareOptions = {
        message: Platform.OS === 'android' ? `${message}\n${imageUrl}` : message,
        url: imageUrl, // iOS can handle 'url' separately
      };

      await Share.share(shareOptions);
    } catch (err) {
      console.log('Error sharing activity:', err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ), // Header opacity effect
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareActivity}>
            <Ionicons name="share-outline" size={22} color={'#000'} />
          </TouchableOpacity>
        </View> // Header share and hearth button
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity> // Header back button
      ),
    });
  }, [navigation, shareActivity, headerAnimatedStyle]);

  // Use useSharedValue and useAnimatedScrollHandler
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, IMG_HEIGHT / 1.5], [0, 1], Extrapolate.CLAMP),
    };
  });

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const handleInteractActivity = async () => {
    if (!userId) {
      Alert.alert(translate('alerts.error'), translate('alerts.must_login_to_join'));
      return;
    }

    const isParticipant = activity.participants.participants_user_id.includes(userId);
    const action = isParticipant ? 'leave' : 'join';

    try {
      const success = await userInteractActivity(userId, activity.id, action);

      if (success) {
        Alert.alert(
          translate('alerts.success'),
          action === 'join'
            ? translate('alerts.joined_activity')
            : translate('alerts.left_activity')
        );

        // Update the activity state
        setActivity((prevActivity) => {
          let updatedParticipants = prevActivity.participants.participants_user_id.slice();

          if (action === 'join') {
            updatedParticipants.push(userId);
          } else {
            updatedParticipants = updatedParticipants.filter((id) => id !== userId);
          }

          return {
            ...prevActivity,
            participants: {
              ...prevActivity.participants,
              participants_user_id: updatedParticipants,
            },
          };
        });
      } else {
        Alert.alert(
          translate('alerts.error'),
          action === 'join'
            ? translate('alerts.failed_to_join')
            : translate('alerts.failed_to_leave')
        );
      }
    } catch (error) {
      console.error(`Error trying to ${action} activity:`, error);
      Alert.alert(translate('alerts.error'), translate('alerts.unexpected_error'));
    }
  };

  const handleUpdateActivityState = async () => {
    if (!userId) {
      Alert.alert(translate('alerts.error'), translate('alerts.must_login_to_modify'));
      return;
    }

    const action = activity.enabled ? 'disable' : 'enable';

    try {
      const success = await updateActivityState(userId, activity.id, action);

      if (success) {
        Alert.alert(
          translate('alerts.success'),
          action === 'enable'
            ? translate('alerts.activity_enabled')
            : translate('alerts.activity_disabled')
        );

        // Update the activity state
        setActivity((prevActivity) => ({
          ...prevActivity,
          enabled: action === 'enable',
        }));
      } else {
        Alert.alert(
          translate('alerts.error'),
          action === 'enable'
            ? translate('alerts.failed_to_enable_activity')
            : translate('alerts.failed_to_disable_activity')
        );
      }
    } catch (error) {
      console.error(`Error trying to ${action} activity:`, error);
      Alert.alert(translate('alerts.error'), translate('alerts.unexpected_error'));
    }
  };

  const handleMapPress = () => {
    const latitude = activity.location.geometry.coordinates.latitude;
    const longitude = activity.location.geometry.coordinates.longitude;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });

    if (url != null) {
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isParticipant = activity.participants.participants_user_id.includes(userId);
  const isActivityFull =
    activity.participants.max &&
    activity.participants.participants_user_id.length >= activity.participants.max &&
    !isParticipant;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.3)" />
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: activity.pictures[0] || '' }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{activity.name}</Text>
          <Text style={styles.location}>
            {capitalize(translate(`activity_types.${activity.activity_type.toLowerCase()}`))}
            {' - '}
            {translate(`activity_sports.${activity.sport_type.toLowerCase()}`)}
          </Text>

          <Text style={styles.location}>{activity.location.smart_location}</Text>

          {activity.datetimes.datetime_start && (
            <Text style={styles.information}>
              {translate('activity_screen.datetime_start')}
              {': '}
              {formatDateTime(activity.datetimes.datetime_start)}
            </Text>
          )}

          {Boolean(activity.datetimes.datetime_finish) && (
            <Text style={styles.information}>
              {translate('activity_screen.datetime_finish')}
              {': '}
              {formatDateTime(activity.datetimes.datetime_finish)}
            </Text>
          )}

          <Text style={styles.information}>
            {translate('activity_screen.participants')}:{' '}
            {activity.participants.participants_user_id.length}
            {activity.participants.max ? ` / ${activity.participants.max}` : ''}
          </Text>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            {hostUser ? (
              <>
                <Image source={{ uri: hostUser.image_url || '' }} style={styles.host} />
                <View>
                  <Text style={styles.hostedByText}>
                    {translate('activity_screen.hosted_by')}{' '}
                    {`${hostUser.first_name || ''} ${hostUser.last_name || ''}`.trim()}
                  </Text>
                  <Text>
                    {translate('activity_screen.host_since')} {formatDate(hostUser.created_at)}
                  </Text>
                </View>
              </>
            ) : (
              <Text>{translate('common.loading')}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{activity.description}</Text>

          {isParticipant && (
            <>
              <View style={styles.divider} />
              <Text style={styles.description}>
                {activity.description_private
                  ? activity.description_private
                  : translate('activity_screen.no_description_private')}
              </Text>
            </>
          )}

          {/* MapView added here */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: activity.location.geometry.coordinates.latitude,
                longitude: activity.location.geometry.coordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={{
                  latitude: activity.location.geometry.coordinates.latitude,
                  longitude: activity.location.geometry.coordinates.longitude,
                }}
              />
            </MapView>
            <Text style={styles.location}>
              {translate('country.' + activity.location.country)}, {activity.location.city}
            </Text>
          </View>

          {userId === activity.host.host_user_id && (
            <>
              <TouchableOpacity
                style={[
                  defaultStyles.btn,
                  { marginVertical: spacing.md, backgroundColor: Colors.grey },
                ]}
                onPress={handleUpdateActivityState}
              >
                <Text style={defaultStyles.btnText}>
                  {activity.enabled
                    ? translate('activity_screen.disable')
                    : translate('activity_screen.enable')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[defaultStyles.btn, { marginVertical: spacing.md }]}
                onPress={() => router.push(`/(modals)/activity/activity-update?activityId=${id}`)}
              >
                <Text style={defaultStyles.btnText}>{translate('activity_screen.edit')}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.ScrollView>

      <View style={[defaultStyles.footer, { height: 70 + insets.bottom }]}>
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>
              {activity.price.value === 0
                ? uppercaseAll(translate('common.free'))
                : `${activity.price.unit} ${activity.price.value}`}
            </Text>
            <Text>{translate('activity_screen.registration')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              defaultStyles.btn,
              { paddingHorizontal: 20 },
              isActivityFull ? styles.disabledBtn : {},
            ]}
            onPress={handleInteractActivity}
            disabled={isActivityFull}
          >
            <Text style={defaultStyles.btnText}>
              {isParticipant
                ? translate('activity_screen.leave_now')
                : translate('activity_screen.join_now')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActivityDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: spacing.lg,
    backgroundColor: Colors.background,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  location: {
    fontSize: 18,
    marginTop: spacing.sm,
    fontFamily: 'mon-sb',
  },
  information: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: 'mon',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: spacing.md,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostedByText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
  description: {
    fontSize: 16,
    marginTop: spacing.sm,
    fontFamily: 'mon',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
  mapContainer: {
    height: 200,
    width: '100%',
    marginTop: spacing.lg,
  },
  map: {
    flex: 1,
    width: '100%',
  },
});
