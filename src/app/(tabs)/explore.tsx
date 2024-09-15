import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import ListingsMap from '@/components/ListingsMap';
import ListingsBottomSheet from '@/components/ListingsBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Screen } from 'src/components/Screen';
import { fetchActivities } from '@/api/filter_activities';

const Page = () => {
  const [category, setCategory] = useState<string>('Trending');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const filterBody = {
        activity_id: null,
      };
      const activities = await fetchActivities(filterBody);
      setItems(activities);
    };
    getData();
  }, []);

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
        <ListingsMap listings={items} />
        <ListingsBottomSheet listings={items} category={category} />
      </GestureHandlerRootView>
    </Screen>
  );
};

export default Page;
