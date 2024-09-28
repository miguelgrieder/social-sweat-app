import { create } from 'apisauce';
import { getUserToken } from '@/api/utils/getUserToken';
import { UpdateUser } from '@/interfaces/user';

export const updateUser = async (userId: string, updateData: UpdateUser): Promise<boolean> => {
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
      },
    });

    const response = await api.put(`/users/${userId}`, updateData);
    if (response.ok && response.data) {
      return true;
    } else {
      console.error('Failed to update user. Response:', {
        status: response.status,
        problem: response.problem,
        data: JSON.stringify(response.data, null, 2),
      });
      return false;
    }
  } catch (error) {
    console.error('An error occurred while updating user:', error);
    return false;
  }
};
