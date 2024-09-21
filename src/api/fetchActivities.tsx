import { create } from 'apisauce';

// Create an instance of the API client
const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_MICROSERVICE,
});

// Function to fetch activities with optional filters
export const fetchActivities = async (filterBody) => {
  try {
    const response = await api.post('/activities', filterBody);
    if (response.ok && response.data) {
      return response.data.activities;
    } else {
      console.error('Failed to fetch activities', response);
      return [];
    }
  } catch (error) {
    console.error('An error occurred while fetching activities:', error);
    return [];
  }
};
