# Social Sweat App

---

## Table of Contents

1. [App Overview](#app-overview)  
2. [Project Structure](#project-structure)  
3. [Integration with Other Services](#integration-with-other-services)  
4. [Getting Started](#getting-started)  
5. [Contributing](#contributing)

---

## App Overview

You can find more information in the Instagram page: https://www.instagram.com/social_sweat/

Social Sweat is a mobile application for iOS and Android that tackles modern challenges of **sedentary behavior** and **social isolation** by making it easier for anyone to find and participate in physical activities, meet like-minded fitness enthusiasts, and connect with professionals. Its main objectives include:

You can find more information in the Instagram page: https://www.instagram.com/social_sweat/

1. **Fostering Community**: Encouraging users to organize group meetups and join local events for fitness activities.  
2. **Promoting Health and Wellness**: Reducing barriers to exercise and motivating users to stay active while socializing.  
3. **Facilitating Instructor & Business Engagement**: Offering trainers and locations a place to list their services and connect with potential clients.

Users can explore new activities and discover events happening nearby—directly through the app’s interface.

Main features:

- **Discover Activities**  
  View a list or map of local activities, such as running groups, fitness classes, or sports tournaments. Filter by sport type or advanced criteria to find exactly what you’re looking for.

- **Join Activities**  
  Quickly sign up for activities of interest. If an event is full, the system prevents new sign-ups, ensuring it meets the maximum capacity.

- **Create Events, Sessions & Locations**  
  Host your own activities (tournaments, open classes, casual meetups) or register permanent locations, such as gyms and studios. You can enable or disable your events and update details any time.

- **Professional Trainers**  
  Trainers can showcase their services. Users can browse a dedicated section to view trainer profiles, qualifications, and offerings.

- **User Profiles**  
  Each user can add a photo, a short bio, their favorite sports, social media links, and see all their created events. This profile also displays personal activity metrics.

- **Multiple Languages**  
  The app supports English and Portuguese, allowing users to switch languages via in-app settings. It can be extended to support additional languages easily.

Activity types:
- **Event**  
  An activity that occurs only once, such as a casual soccer game, a special bike class, a group hiking trip, or a marathon.
- **Session**  
  A recurring class scheduled at regular intervals, such as weekly or monthly martial arts classes or running sessions. 
- **Spot**  
  A permanent location that does not depend on a specific time for practice, such as a gym, skate track, or open pool. 

User types:
- **User(casual user)**  
  A casual user or athlete who can only create Event activities.
- **Coach**  
  A coach or trainer who offers training in specific sports and can create both Event and Session activities.
- **Company**  
  A fitness location or organization that can create Events, Sessions, and Spots.


---

## Project Structure

Below is a simplified view of the **frontend project structure** with the main directories and files.

```
.
├── app.config.js            # Env and id configs for expo eas
├── app.json                 # App configuration for Expo
├── assets                   # Static assets like data, fonts, images
├── babel.config.js          # Babel configuration file
├── eas.json                 # Configs for expo eas
├── env.d.ts                 # Typing configs for env 
├── eslint.config.js         # ESLint configuration file
├── expo-env.d.ts            # TypeScript declarations for Expo environment variables
├── package.json             # NPM package configuration and dependencies
├── package-lock.json        # Lock file for package versions
├── README.md                # Project documentation
├── src                      # Source code for the application
│   ├── api                  # API functions and services - camelCase
│   ├── app                  # Main application logic and screens - kebab-case
│   │   ├── (modals)         # Screens opened as modals
│   │   ├── (tabs)           # Tab navigation screens
│   │   ├── activity         # Screens related to activities
│   │   ├── locales          # JSON translation files for i18n
│   │   ├── services         # Application-wide services like i18n
│   │   └── user             # Screens related to users
│   ├── components           # Reusable UI components - PascalCase
│   ├── constants            # Global constants for styling/settings - PascalCase or camelCase
│   ├── context              # Context variables - PascalCase
│   ├── hooks                # Custom React hooks - camelCase
│   ├── interfaces           # TypeScript interfaces/data models - kebab-case
│   └── utils                # General utility functions/helpers - camelCase
├── .env.example             # Environment variables configuration example file
├── .gitignore               # Git ignore rules
├── .prettierignore          # Prettier ignore rules
├── .prettierrc.json         # Prettier configuration file
└── tsconfig.json            # TypeScript compiler configuration
```

---

## Integration with Other Services

Although the **frontend** can run independently as a React Native app, it **relies** on several external services:

- **Backend (Microservice)**  
  A dedicated backend service is required for this app’s core features (e.g., activity creation, user data).  
  - **Env Variable**: `EXPO_PUBLIC_API_MICROSERVICE` must be set to the backend’s URL.  
  - **Repository**: [microservice-social-sweat](https://github.com/miguelgrieder/microservice-social-sweat)

- **Clerk**  
  Handles user authentication and account management.  
  - **Env Variable**: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` must be set for Clerk usage.

- **Google Maps API Key**  
  Enables map geocoding for activity creation.  
  - **Env Variable**: `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` must be set for Google Maps geocoding.

- **Expo Publish Service** (Optional)  
  Used for publishing/distributing the app via the Expo Publish Service, so you can host the app in the cloud.  
  - You’ll need an Expo account.
  - Change the hard-codded project id for your own expo project id. Current: `1937b145-840a-46f9-9132-a4d3fe42925f`

---

## Getting Started

1. **Clone this Repository**  
   ```bash
   git clone https://github.com/username/social-sweat-app.git
   ```

2. **Install Dependencies**  
   Make sure you have [Node.js](https://nodejs.org/) and npm installed. For consistency with the provided `package-lock.json`, you can use:
   ```bash
   npm install
   ```
   *Alternatively, you can run `yarn install` if you prefer Yarn over npm.*

3. **Set Up Environment Variables**  
   - Create a `.env` file from `.env.example`.  
   - Add required environment variables:
     - **`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`**  
       Your Clerk publishable key (e.g., `pk_test_XYZ`).

     - **`EXPO_PUBLIC_API_MICROSERVICE`**  
       URL for the microservice (e.g., `http://192.168.1.190:8000/` or a cloud URL).

     - **`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`**  
       Google Maps API key (e.g., `XYZ`).

     - **`EXPO_PUBLIC_VERSION`**  
       Version identifier, preferably in `major.minor.patch` format (e.g., `1.2.3`).

4. **Run the App**  
   ```bash
   npx expo start
   ```
   - Launch on an Android emulator, iOS simulator, or a physical device using the Expo Go app.

---

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue to report a bug or request a new feature. Before contributing, please make sure you:

- Follow the existing code style and linting rules. Run:
  ```bash
  npm run format
  npm run lint
  ```
- Provide a clear description of your changes and the motivation behind them.  
- Add or update tests for the changes you introduce.

---

If you have any questions or need assistance, don’t hesitate to reach out or open an issue. **Stay fit and have fun!**