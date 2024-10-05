import { View, Text, ListRenderItem, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';
import { Activity } from '@/interfaces/activity';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { formatDateTime } from '@/utils/utils';

interface Props {
  activities: any[];
  category: string;
  refresh: number;
}
const Activities = ({ activities: items, category, refresh }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<BottomSheetFlatListMethods>(null);

  // Update the view to scroll the list back top
  useEffect(() => {
    if (refresh) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [refresh]);

  useEffect(() => {
    console.log('RELOADING LISTINGS: ', items.length);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  const renderRow: ListRenderItem<Activity> = ({ item }) => {
    const formattedDateTime = formatDateTime(item.datetimes?.datetime_start);

    return (
      <Link href={`/activity/${item.id}`} asChild>
        <TouchableOpacity>
          <Animated.View style={styles.activity} entering={FadeInRight} exiting={FadeOutLeft}>
            {/* Image & widgets */}
            <Animated.Image source={{ uri: item.pictures[0] }} style={styles.image} />
            {formattedDateTime && (
              <View style={styles.datetimeWidget}>
                <Text style={styles.datetimeText}>{formattedDateTime}</Text>
              </View>
            )}

            {/* Title */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, fontFamily: 'mon-sb' }}>{item.name}</Text>
            </View>

            {/* Smart Location */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="location-outline" size={spacing.md} style={styles.locationIcon} />
              <Text>{item.location.smart_location}</Text>
            </View>

            {/* Price - Activity Type and Sport Type */}
            <View
              style={{ flexDirection: 'row', gap: spacing.xxs, justifyContent: 'space-between' }}
            >
              <Text style={{ fontFamily: 'mon-sb' }}>
                {item.price.unit} {item.price.value}
              </Text>
              <Text style={{ fontFamily: 'mon', fontSize: spacing.md }}>
                {item.activity_type} - {item.sport_type}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={defaultStyles.container}>
      <BottomSheetFlatList
        renderItem={renderRow}
        ref={listRef}
        data={loading ? [] : items}
        keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
        ListHeaderComponent={
          <Text style={styles.info}>
            {items.length} {translate('activities.activities')}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  locationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    textAlign: 'center',
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginTop: spacing.xxs,
  },
  datetimeWidget: {
    position: 'absolute',
    right: spacing.xl,
    top: spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    borderRadius: spacing.xs,
  },
  datetimeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'mon',
  },
});

export default Activities;
