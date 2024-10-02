import React, { useCallback, useState } from 'react';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import ActivitiesMap from '@/components/ActivitiesMap';
import ActivitiesBottomSheet from '@/components/ActivitiesBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchActivities } from '@/api/fetchActivities';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window'); // Obtém a altura da tela

export default function ActivitiesPage() {
  const [category, setCategory] = useState<string>('Trending');
  const [items, setItems] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const getData = async () => {
        const filterBody = {
          activity_id: null,
        };
        const activities = await fetchActivities(filterBody);
        setItems(activities);
      };

      getData();
    }, [])
  );

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={[styles.container, { paddingTop: useSafeAreaInsets().top + 80 }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ExploreHeader onCategoryChanged={onDataChanged} />
      <GestureHandlerRootView style={styles.gestureHandlerContainer}>
        <ActivitiesMap activities={items} />
        <ActivitiesBottomSheet activities={items} category={category} />
      </GestureHandlerRootView>
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
});
