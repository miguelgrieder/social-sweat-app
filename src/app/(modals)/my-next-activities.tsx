import React from 'react';
import ActivitiesPage from '@/components/ActivitiesPage';
import { useUser } from '@clerk/clerk-expo';

export default function NextActivitiesTab() {
  const { user } = useUser();

  const initialFilter = {
    host_user_id: user.id,
  };

  return <ActivitiesPage initialFilter={initialFilter} callerSource={'my_next_activities'} />;
}
