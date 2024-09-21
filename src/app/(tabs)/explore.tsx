import React, { useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import ActivitiesMap from '@/components/ActivitiesMap';
import ActivitiesBottomSheet from '@/components/ActivitiesBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Screen } from 'src/components/Screen';
import { fetchActivities } from '@/api/filter_activities';
import { useFocusEffect } from '@react-navigation/native';

const Page = () => {
  const [category, setCategory] = useState<string>('Trending');
  const [items, setItems] = useState<any[]>([]);

  useFocusEffect(
    // Always load activities when enter the page
    useCallback(() => {
      const getData = async () => {
        const filterBody = {
          activity_id: null,
        };
        const activities = await fetchActivities(filterBody);
        setItems(activities);
      };

      getData();
    }, []) // Empty dependency array ensures the callback doesn't change
  );

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <Screen preset="fixed" contentContainerStyle={{ flex: 1 }} safeAreaEdges={['top']}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      <GestureHandlerRootView>
        <ActivitiesMap listings={items} />
        <ActivitiesBottomSheet listings={items} category={category} />
      </GestureHandlerRootView>
    </Screen>
  );
};

export default Page;
