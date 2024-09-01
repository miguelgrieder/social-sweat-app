import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import Listings from '@/components/Listings';
import ExploreHeader from '@/components/ExploreHeader';

const Page = () => {
  const onDataChanged = (category: string) => {
    console.log('CHANGED_', category);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      <Listings />
    </View>
  );
};

export default Page;
