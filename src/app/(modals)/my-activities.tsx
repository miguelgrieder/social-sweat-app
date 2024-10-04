import React from 'react';
import ActivitiesPage from '@/components/ActivitiesPage';
import { useUser } from '@clerk/clerk-expo';

export default function MyActivitiesTab() {
  const { user } = useUser();

  const initialFilter = {
    participant_user_id: user.id,
  };

  return <ActivitiesPage initialFilter={initialFilter} callerSource={'my_activities'} />;
}
