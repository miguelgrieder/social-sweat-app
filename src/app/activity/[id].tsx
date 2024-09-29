import { useLocalSearchParams, useNavigation } from 'expo-router';
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
    max: 0,
  },
  reviews: {
    number_of_reviews: 0,
    review_scores_rating: 0,
  },
  pictures: [],
  host: {
    host_user_id: '', // Ensure host_user_id is included
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
  const [activity, setActivity] = useState<Activity>(dummy_listing);
  const [hostUser, setHostUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

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

  const shareListing = async () => {
    // Share functionality of header share button
    try {
      await Share.share({
        title: activity.name,
        url: activity.pictures[0] || '',
      });
    } catch (err) {
      console.log(err);
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
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={'#000'} />
          </TouchableOpacity>
        </View> // Header share and hearth button
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity> // Header back button
      ),
    });
  }, [navigation, shareListing, headerAnimatedStyle]);

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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
            {activity.activity_type} {translate('common.in')} {activity.location.smart_location}
          </Text>
          <Text style={styles.information}>
            {activity.participants.participants_user_id.length}{' '}
            {translate('activity_screen.participants')}
          </Text>
          <View style={styles.rowContainer}>
            <Ionicons name="star" size={16} />
            <Text style={[styles.ratings, { marginLeft: spacing.xxs }]}>
              {activity.reviews.review_scores_rating / 20} · {activity.reviews.number_of_reviews}
              &nbsp;
              {translate('activity_screen.reviews')}
            </Text>
          </View>
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
              <Text>{translate('activity_screen.loading_host_info')}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{activity.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View style={[defaultStyles.footer, { height: 70 }]}>
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>
              {activity.price.unit}
              {activity.price.value}
            </Text>
            <Text>{translate('activity_screen.registration')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[defaultStyles.btn, { paddingHorizontal: 20 }]}>
            <Text style={defaultStyles.btnText}>{translate('activity_screen.join_now')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
});
