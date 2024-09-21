import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';
import { Activity } from '@/interfaces/activity';
import { Screen } from 'src/components/Screen';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { fetchActivities } from '@/api/fetchActivities';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const dummy_listing = {
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
      type: '',
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
  },
  participants: {
    current: 0,
    max: null,
  },
  reviews: {
    number_of_reviews: 0,
    review_scores_rating: 0,
  },
  pictures: [],
  host: {
    host_picture_url: '',
    host_name: '',
    host_since: '',
  },
  datetimes: {
    datetime_created: '',
    datetime_deleted: null,
    datetime_start: '',
    datetime_finish: '',
  },
};

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activity, setListing] = useState<Activity>(dummy_listing);
  useEffect(() => {
    const getData = async () => {
      const filterBody = {
        activity_id: id,
      };
      const activities = await fetchActivities(filterBody);
      setListing(activities[0]);
    };
    getData();
  }, []);

  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const shareListing = async () => {
    // Share functionality of header share button
    try {
      await Share.share({
        title: activity.name,
        url: activity.pictures[0],
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
  }, []);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);
  return (
    <Screen preset="scroll" contentContainerStyle={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: activity.pictures[0] }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{activity.name}</Text>
          <Text style={styles.location}>
            {activity.activity_type} {translate('common.in')} {activity.location.smart_location}
          </Text>
          <Text style={styles.information}>
            {activity.participants.current} {translate('activity_screen.participants')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {activity.reviews.review_scores_rating / 20} · {activity.reviews.number_of_reviews}
              {translate('activity_screen.reviews')}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image source={{ uri: activity.host.host_picture_url }} style={styles.host} />

            <View>
              <Text style={{ fontWeight: '500', fontSize: 16 }}>
                {translate('activity_screen.hosted_by')} {activity.host.host_name}
              </Text>
              <Text>Host since {activity.host.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{activity.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>
              {activity.price.unit}
              {activity.price.value}
            </Text>
            <Text>{translate('activity_screen.registration')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
            <Text style={defaultStyles.btnText}>{translate('activity_screen.join_now')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: spacing.lg,
    backgroundColor: '#fff',
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
});

export default Page;
