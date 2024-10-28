# Social Sweat App

Project and case guide: (2024-09-21)

```
.
├── assets                   # Static assets like data, fonts, images
├── src                      # Source code for the application
│   ├── api                  # API functions and services - camelCase
│   ├── app                  # Main application logic and screens - kebab-case
│   │   ├── (modals)         # Screens opened as modals
│   │   ├── (tabs)           # Tab navigation screens
│   │   ├── activity         # Screens related to activities
│   │   ├── locales          # JSON translation files for i18n
│   │   └── services         # Application-wide services like i18n
│   ├── components           # Reusable UI components - PascalCase
│   ├── constants            # Global constants for styling and settings - PascalCase and camelCase
│   ├── hooks                # Custom React hooks - camelCase
│   ├── interfaces           # TypeScript interfaces and data models - kebab-case
│   └── utils                # General utility functions and helpers - camelCase
├── .env.example             # Environment variables configuration example file
├── .gitignore               # Git ignore rules
├── .prettierignore          # Prettier ignore rules
├── .prettierrc.json         # Prettier configuration file
├── app.json                 # App configuration for Expo
├── babel.config.js          # Babel configuration file
├── eslint.config.js         # ESLint configuration file
├── expo-env.d.ts            # TypeScript declarations for Expo environment variables
├── package.json             # NPM package configuration and dependencies
├── package-lock.json        # Lock file for package versions
├── README.md                # Project documentation
└── tsconfig.json            # TypeScript compiler configuration
```
