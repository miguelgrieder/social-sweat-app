import { View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import listingsData from 'assets/data/activity-listings.json';
import listingsDataGeo from 'assets/data/activity-listings.geo.json';
import ListingsMap from '@/components/ListingsMap';
import ListingsBottomSheet from '@/components/ListingsBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { defaultStyles } from '@/constants/Styles';
import { Screen } from 'src/components/Screen';

const Page = () => {
  const [category, setCategory] = useState<string>('Trending');
  const geoItems = useMemo(() => listingsDataGeo, []);

  const items = useMemo(() => listingsData as any, []);

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
        <ListingsMap listings={geoItems} />
        <ListingsBottomSheet listings={items} category={category} />
      </GestureHandlerRootView>
    </Screen>
  );
};

export default Page;
