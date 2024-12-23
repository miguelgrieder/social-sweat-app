import { View, Text, ListRenderItem, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Activity } from '@/interfaces/activity';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import Loading from '@/components/Loading';
import Colors from '@/constants/Colors';
import ActivityItem from '@/components/activity/ActivityItem';

interface Props {
  activities: Activity[];
  category: string;
  refresh: number;
}

const ActivitiesBottomSheetList = ({ activities: items, category, refresh }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<BottomSheetFlatListMethods>(null);

  // Update the view to scroll the list back to top when refreshed
  useEffect(() => {
    if (refresh) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [refresh]);

  useEffect(() => {
    console.log('RELOADING LISTINGS: ', items.length);
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [category, items.length]);

  const renderRow: ListRenderItem<Activity> = ({ item }) => {
    return <ActivityItem activity={item} />;
  };

  return (
    <View style={defaultStyles.container}>
      {loading ? (
        <Loading />
      ) : (
        <BottomSheetFlatList
          renderItem={renderRow}
          ref={listRef}
          data={items}
          keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
          ListHeaderComponent={
            <Text style={styles.info}>
              {items.length} {translate('activities.activities')}
            </Text>
          }
          contentContainerStyle={items.length === 0 && styles.emptyList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{translate('activity_screen.no_activities')}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ActivitiesBottomSheetList;

const styles = StyleSheet.create({
  info: {
    textAlign: 'center',
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginTop: spacing.xxs,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
