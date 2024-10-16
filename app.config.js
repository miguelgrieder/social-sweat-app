export default ({ config }) => ({
  ...config,
  extra: {
    eas: {
      projectId: "2861e101-a356-495c-b3f1-382c44216a5a",
    },
    apiMicroserviceUrl: process.env.EXPO_PUBLIC_API_MICROSERVICE,
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  updates: {
    url: "https://u.expo.dev/2861e101-a356-495c-b3f1-382c44216a5a",
  },
  runtimeVersion: {
    policy: "appVersion", // Recommended runtime versioning policy
  }
});
