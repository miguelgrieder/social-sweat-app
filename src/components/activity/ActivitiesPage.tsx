import React, { useCallback, useState } from 'react';
import { Link, Stack, useFocusEffect } from 'expo-router';
import ActivitiesHeader from '@/components/activity/ActivitiesHeader';
import ActivitiesMap from '@/components/activity/ActivitiesMap';
import ActivitiesBottomSheet from '@/components/activity/ActivitiesBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchActivities } from '@/api/fetchActivities';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FilterActivityInput, SportType } from '@/interfaces/activity';
import { useFilters } from '@/context/FilterActivityInputContext';
import { translate } from '@/app/services/translate';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';

interface ActivitiesPageProps {
  initialFilter?: FilterActivityInput;
  callerSource: string;
}

export default function ActivitiesPage({
  initialFilter,
  callerSource = 'activities',
}: ActivitiesPageProps) {
  const [category, setCategory] = useState<string>('trending-up'); // Default to 'Trending'
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    <View style={[styles.container]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: translate(`activity_screen.${callerSource}`),
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerRight: () => (
            <Link href={'/(modals)/activities-filter'} asChild>
              <TouchableOpacity style={styles.filterBtn}>
                <MaterialCommunityIcons name="filter-variant" size={spacing.lg} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <View style={{ position: 'absolute' }}>
        <ActivitiesHeader onCategoryChanged={handleCategoryChange} />
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
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
  filterBtn: {
    paddingRight: spacing.md,
  },
});
