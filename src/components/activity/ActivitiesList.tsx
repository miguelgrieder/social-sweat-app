// src/components/activity/ActivitiesList.tsx

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchActivities } from '@/api/fetchActivities';
import { Activity } from '@/interfaces/activity';
import ActivityItem from '@/components/activity/ActivityItem';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/spacing';
import { translate } from '@/app/services/translate';

interface ActivitiesListProps {
  userId: string;
}

const ActivitiesList = ({ userId }: ActivitiesListProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filterBody = {
        user_id: userId,
      };
      const fetchedActivities = await fetchActivities(filterBody);
      setActivities(fetchedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to load activities.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [getData])
  );

  const renderItem = ({ item }: { item: Activity }) => <ActivityItem activity={item} />;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <Text style={styles.info}>
            {activities.length} {translate('activities.activities')}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{translate('activity_screen.no_activities')}</Text>
          </View>
        }
        contentContainerStyle={activities.length === 0 && styles.emptyList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ActivitiesList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: spacing.lg,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  errorContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  info: {
    textAlign: 'center',
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginTop: spacing.xxs,
    marginBottom: spacing.sm,
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
