export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiMicroserviceUrl: process.env.EXPO_PUBLIC_API_MICROSERVICE,
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  };
};
