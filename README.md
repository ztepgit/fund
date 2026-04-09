# Mutual Fund Tracker - React Native Expo App

A mobile app for tracking Indian mutual funds with favorites functionality.

## Features

- Browse all mutual funds from MFAPI
- Search funds by name
- View fund details with NAV history chart
- Add/remove funds from favorites (persisted locally)
- Bottom tab navigation

## Tech Stack

- **React Native** with **Expo SDK 50**
- **TypeScript** for type safety
- **TanStack Query** for server state management
- **Zustand + Immer** for local state (favorites)
- **React Navigation** for navigation

## Project Structure

```
src/
├── api/          # API service functions
├── components/   # Reusable UI components
├── constants/    # Theme and constants
├── hooks/        # Custom hooks (TanStack Query)
├── navigation/   # Navigation configuration
├── providers/    # Context providers
├── screens/      # Screen components
├── store/        # Zustand stores
└── types/        # TypeScript types
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Add AsyncStorage for persistence:
   ```bash
   npx expo install @react-native-async-storage/async-storage
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your device:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app

## API

Uses the free [MFAPI](https://www.mfapi.in/) for mutual fund data:
- `GET /mf` - List all funds
- `GET /mf/{schemeCode}` - Get fund details
- `GET /mf/search?q={query}` - Search funds

## Notes

- The app limits initial fund list to 100 items for performance
- Search requires at least 2 characters
- Favorites are persisted using AsyncStorage
- NAV history chart shows last 30 days of data
