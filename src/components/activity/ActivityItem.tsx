// src/components/activity/ActivityItem.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '@/constants/spacing';
import { capitalize, formatDateTime, uppercaseAll } from '@/utils/utils';
import { translate } from '@/app/services/translate';
import { Activity } from '@/interfaces/activity';
import Colors from '@/constants/Colors';

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const formattedDateTime = formatDateTime(activity.datetimes?.datetime_start);
  const hasImage = activity.pictures && activity.pictures.length > 0;

  return (
    <Link href={`/activity/${activity.id}`} asChild>
      <TouchableOpacity>
        <Animated.View style={styles.activity} entering={FadeInRight} exiting={FadeOutLeft}>
          {/* Image & Widgets */}
          {hasImage ? (
            <Image source={{ uri: activity.pictures[0] }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{translate('activity_screen.no_image')}</Text>
            </View>
          )}
          {formattedDateTime && (
            <View style={styles.datetimeWidget}>
              <Text style={styles.datetimeText}>{formattedDateTime}</Text>
            </View>
          )}

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{activity.name}</Text>
          </View>

          {/* Smart Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={spacing.md} style={styles.locationIcon} />
            <Text style={styles.locationText}>{activity.location.smart_location}</Text>
          </View>

          {/* Price - Activity Type and Sport Type */}
          <View style={styles.detailsContainer}>
            <Text style={styles.priceText}>
              {activity.price.value === 0
                ? uppercaseAll(translate('common.free'))
                : `${activity.price.unit} ${activity.price.value}`}
            </Text>
            <Text style={styles.typeText}>
              {capitalize(translate(`activity_types.${activity.activity_type.toLowerCase()}`))}
              {' - '}
              {translate(`activity_sports.${activity.sport_type.toLowerCase()}`)}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default ActivityItem;

const styles = StyleSheet.create({
  activity: {
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: spacing.md,
    height: 350, // Fixed height for consistency
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  placeholder: {
    backgroundColor: Colors.primary_light, // Using primary_light background
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  placeholderText: {
    color: Colors.grey, // Using grey color for placeholder text
    fontSize: 14,
    fontFamily: 'mon',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  datetimeWidget: {
    position: 'absolute',
    right: spacing.xl,
    top: spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    borderRadius: spacing.sm,
  },
  datetimeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'mon',
  },
  titleContainer: {
    marginTop: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontFamily: 'mon-sb',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  locationIcon: {
    marginRight: spacing.xs,
  },
  locationText: {
    fontSize: spacing.sm,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  priceText: {
    fontFamily: 'mon-sb',
    fontSize: spacing.md,
    color: Colors.primary,
  },
  typeText: {
    fontFamily: 'mon',
    fontSize: spacing.md,
  },
});
