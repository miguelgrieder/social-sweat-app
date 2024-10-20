import React, { useEffect } from 'react';
import ActivitiesPage from '@/components/activity/ActivitiesPage';
import { useFilters } from '@/context/FilterActivityInputContext';

export default function ActivitiesTab() {
  const { setFilters } = useFilters();

  const initialFilter = {
    datetime_start: new Date().toISOString(),
  };

  useEffect(() => {
    setFilters({});
  }, [setFilters]);

  return <ActivitiesPage initialFilter={initialFilter} />;
}
