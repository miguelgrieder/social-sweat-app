import { create } from 'apisauce';
import { User, FilterUser } from '@/interfaces/user';
import { getUserToken } from '@/api/utils/getUserToken';

export const fetchUsers = async (filterBody: FilterUser): Promise<User[]> => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.error('User token is not available.');
      return [];
    }

    const api = create({
      baseURL: process.env.EXPO_PUBLIC_API_MICROSERVICE,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await api.post('/users', filterBody);
    if (response.ok && response.data) {
      return response.data.users as User[];
    } else {
      console.error('Failed to fetch users. Response:', {
        status: response.status,
        problem: response.problem,
        data: JSON.stringify(response.data, null, 2),
      });
      return [];
    }
  } catch (error) {
    console.error('An error occurred while fetching users:', error);
    return [];
  }
};
