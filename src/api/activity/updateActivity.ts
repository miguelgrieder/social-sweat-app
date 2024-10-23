import { create } from 'apisauce';
import { getUserToken } from '@/api/utils/getUserToken';
import { UpdateActivityInput } from '@/interfaces/activity';

export const updateActivity = async (payload: UpdateActivityInput) => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.error('User token is not available.');
      return null;
    }

    const api = create({
      baseURL: process.env.EXPO_PUBLIC_API_MICROSERVICE,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await api.put('/activities/update', payload);

    if (response.ok && response.data) {
      return response.data;
    } else {
      console.error('Failed to update activity. Response:', {
        status: response.status,
        problem: response.problem,
        data: JSON.stringify(response.data, null, 2),
      });
      return null;
    }
  } catch (error) {
    console.error('An error occurred while updating the activity:', error);
    return null;
  }
};
