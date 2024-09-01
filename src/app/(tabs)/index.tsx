import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import Listings from '@/components/Listings';
import ExploreHeader from '@/components/ExploreHeader';

const Page = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader />,
        }}
      />
      <Listings />
    </View>
  );
};

export default Page;
