import React, { useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import ActivitiesHeader from '@/components/ActivitiesHeader';
import ActivitiesMap from '@/components/ActivitiesMap';
import ActivitiesBottomSheet from '@/components/ActivitiesBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchActivities } from '@/api/fetchActivities';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterActivityInput, SportType } from '@/interfaces/activity';
import { useFilters } from '@/context/FilterActivityInputContext';

interface ActivitiesPageProps {
  initialFilter?: FilterActivityInput;
}

export default function ActivitiesPage({ initialFilter }: ActivitiesPageProps) {
  const [category, setCategory] = useState<string>('trending-up'); // Default to 'Trending'
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const { filters } = useFilters();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      let filterBody: FilterActivityInput = {};

      // Apply filters from search modal
      if (filters) {
        filterBody = { ...filterBody, ...filters };
      }

      // Apply category filter (from ActivitiesHeader)
      if (category !== 'trending-up') {
        filterBody.sport_types = [category as SportType];
      }

      // Apply initial filter (overrides any existing fields)
      if (initialFilter) {
        filterBody = { ...filterBody, ...initialFilter };
      }

      const activities = await fetchActivities(filterBody);
      setItems(activities);
    } finally {
      setLoading(false);
    }
  }, [category, filters, initialFilter]);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [getData])
  );

  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ActivitiesHeader onCategoryChanged={handleCategoryChange} />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <GestureHandlerRootView style={styles.gestureHandlerContainer}>
          <ActivitiesMap activities={items} />
          <ActivitiesBottomSheet activities={items} category={category} />
        </GestureHandlerRootView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureHandlerContainer: {
    flex: 1,
    zIndex: -9999,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
