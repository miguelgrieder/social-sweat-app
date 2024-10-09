import React, { useEffect } from 'react';
import ActivitiesPage from '@/components/ActivitiesPage';
import { useUser } from '@clerk/clerk-expo';
import { useFilters } from '@/context/FilterActivityInputContext';
import NotLoggedInMessage from '@/components/NotLoggedInMessage';
import { Stack } from 'expo-router';
import { translate } from '@/app/services/translate';

export default function NextActivitiesTab() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setFilters } = useFilters();

  useEffect(() => {
    setFilters({});
  }, [setFilters]);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn || !user) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            title: translate('common.unauthorized'),
            headerShadowVisible: false,
            headerTitleAlign: 'center',
          }}
        />
        <NotLoggedInMessage addLink={false} />
      </>
    );
  }

  const initialFilter = {
    participant_user_id: user.id,
    datetime_start: new Date().toISOString(),
  };

  return <ActivitiesPage initialFilter={initialFilter} callerSource={'my_next_activities'} />;
}
