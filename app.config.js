export default ({ config }) => ({
  ...config,
  extra: {
    eas: {
      projectId: "1937b145-840a-46f9-9132-a4d3fe42925f",
    },
    apiMicroserviceUrl: process.env.EXPO_PUBLIC_API_MICROSERVICE,
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  updates: {
    url: "https://u.expo.dev/1937b145-840a-46f9-9132-a4d3fe42925f",
  },
  runtimeVersion: {
    policy: "appVersion", // Recommended runtime versioning policy
  }
});
