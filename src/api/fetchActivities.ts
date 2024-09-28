import { create } from 'apisauce';
import { getUserToken } from '@/api/utils/getUserToken';

export const fetchActivities = async (filterBody: any) => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.error('User token is not available.');
      return [];
    }
    console.error(`Sending token ${token}`);
    const api = create({
      baseURL: process.env.EXPO_PUBLIC_API_MICROSERVICE,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await api.post('/activities', filterBody);
    if (response.ok && response.data) {
      return response.data.activities;
    } else {
      console.error('Failed to fetch activities. Response:', {
        status: response.status,
        problem: response.problem,
        data: JSON.stringify(response.data, null, 2),
      });
      return [];
    }
  } catch (error) {
    console.error('An error occurred while fetching activities:', error);
    return [];
  }
};
