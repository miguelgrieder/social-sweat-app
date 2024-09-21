import { create } from 'apisauce';

// Create an instance of the API client
const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_MICROSERVICE,
});

// Function to create an activity
export const createActivity = async (activityBody) => {
  try {
    const response = await api.post('/activities/create', activityBody);
    if (response.ok && response.data) {
      return response.data;
    } else {
      console.error('Failed to create activity. Response:', {
        status: response.status,
        problem: response.problem,
        data: JSON.stringify(response.data, null, 2),
      });
      return null;
    }
  } catch (error) {
    console.error('An error occurred while creating the activity:', error);
    return null;
  }
};
