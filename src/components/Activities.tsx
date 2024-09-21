import { View, Text, ListRenderItem, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';
import { Activity } from '@/interfaces/activity';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';

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

  const renderRow: ListRenderItem<Activity> = ({ item }) => (
    <Link href={`/activity/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View style={styles.activity} entering={FadeInRight} exiting={FadeOutLeft}>
          <Animated.Image source={{ uri: item.pictures[0] }} style={styles.image} />
          <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontFamily: 'mon-sb' }}>{item.name}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Ionicons name="star" size={16} />
              <Text style={{ fontFamily: 'mon-sb' }}>{item.reviews.review_scores_rating / 20}</Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'mon' }}>{item.activity_type}</Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Text style={{ fontFamily: 'mon-sb' }}>
              {item.price.unit} {item.price.value}
            </Text>
            <Text style={{ fontFamily: 'mon' }}>{translate('activities.registration')}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
  return (
    <View style={defaultStyles.container}>
      <BottomSheetFlatList
        renderItem={renderRow}
        ref={listRef}
        data={loading ? [] : items}
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
    gap: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  info: {
    textAlign: 'center',
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginTop: spacing.xxs,
  },
});

export default Activities;
