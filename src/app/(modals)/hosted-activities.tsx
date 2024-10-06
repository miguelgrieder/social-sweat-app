import React, { useEffect } from 'react';
import ActivitiesPage from '@/components/ActivitiesPage';
import { useUser } from '@clerk/clerk-expo';
import { useFilters } from '@/context/FilterActivityInputContext';

export default function HostedActivitiesTab() {
  const { user } = useUser();
  const { setFilters } = useFilters();

  useEffect(() => {
    setFilters({});
  }, [setFilters]);

  const initialFilter = {
    host_user_id: user.id,
  };

  return <ActivitiesPage initialFilter={initialFilter} callerSource={'hosted_activities'} />;
}
