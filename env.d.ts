// env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_API_MICROSERVICE: string;
    readonly EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    readonly EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  }
}
