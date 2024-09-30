import { create } from 'apisauce';
import { getUserToken } from '@/api/utils/getUserToken';

interface UserInteractActivityRequest {
  user_id: string;
  activity_id: string;
  action: 'join' | 'leave';
}

interface UserInteractActivityResponse {
  message: string;
}

export const userInteractActivity = async (
  userId: string,
  activityId: string,
  action: 'join' | 'leave'
): Promise<boolean> => {
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

    const requestPayload: UserInteractActivityRequest = {
      user_id: userId,
      activity_id: activityId,
      action,
    };

    const response = await api.post<UserInteractActivityResponse>(
      '/activities/user_interact_activity',
      requestPayload
    );

    if (response.ok && response.data) {
      console.log(`User successfully ${action}ed the activity:`, response.data.message);
      return true;
    } else {
      console.error(`Failed to ${action} activity. Response:`, {
        status: response.status,
        problem: response.problem,
        data: response.data,
      });
      return false;
    }
  } catch (error) {
    console.error(`An error occurred while trying to ${action} activity:`, error);
    return false;
  }
};
