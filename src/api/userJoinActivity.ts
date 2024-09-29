import { create } from 'apisauce';
import { getUserToken } from '@/api/utils/getUserToken';

interface UserJoinActivityRequest {
  user_id: string;
  activity_id: string;
}

interface UserJoinActivityResponse {
  message: string;
}

export const userJoinActivity = async (userId: string, activityId: string): Promise<boolean> => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.error('User token is not available.');
      return false;
    }

    const api = create({
      baseURL: process.env.EXPO_PUBLIC_API_MICROSERVICE,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const requestPayload: UserJoinActivityRequest = {
      user_id: userId,
      activity_id: activityId,
    };

    const response = await api.post<UserJoinActivityResponse>(
      '/activities/user_join_activity',
      requestPayload
    );

    if (response.ok && response.data) {
      console.log('User successfully joined the activity:', response.data.message);
      return true;
    } else {
      console.error('Failed to join activity. Response:', {
        status: response.status,
        problem: response.problem,
        data: response.data,
      });
      return false;
    }
  } catch (error) {
    console.error('An error occurred while joining activity:', error);
    return false;
  }
};
