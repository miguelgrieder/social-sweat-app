import { create } from 'apisauce';
import { getUserToken } from '@/api/utils/getUserToken';

interface UpdateActivityStateRequest {
  action: 'enable' | 'disable';
  user_id: string;
  activity_id: string;
}

interface UpdateActivityStateResponse {
  acknowledged: boolean;
  modified_count: number;
  matched_count: number;
}

export const updateActivityState = async (
  userId: string,
  activityId: string,
  action: 'enable' | 'disable'
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

    const requestPayload: UpdateActivityStateRequest = {
      user_id: userId,
      activity_id: activityId,
      action,
    };

    const response = await api.put<UpdateActivityStateResponse>(
      '/activities/state',
      requestPayload
    );

    if (response.ok && response.data) {
      console.log(`Activity successfully changed state to ${action}:`, response.data);
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
    console.error(`An error occurred while trying to set activity state to ${action} :`, error);
    return false;
  }
};
