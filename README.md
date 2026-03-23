# React Native Expo GoldCrest App

A feature-rich React Native clone of the Wolt food delivery app, showcasing modern mobile development practices with React Native, Expo, and TypeScript.

> **Note:** This is a clone app with dummy data for demonstration purposes only. No real backend is connected.
>
> **Sponsored by:** [Sentry](https://dub.sh/trysentry) - Application monitoring and error tracking | [CodeRabbit](https://coderabbit.link/simon) - AI-powered code reviews

## Features

- **User Authentication**: Apple and Google sign-in integration
- **Restaurant Discovery**: Browse restaurants and stores with beautiful UI
- **Search & Filter**: Find exactly what you're looking for with advanced filters
- **Interactive Map**: Explore restaurants and delivery zones on an interactive map
- **Menu Navigation**: Browse detailed menus with categories and items
- **Shopping Cart**: Add items, manage quantities, and see real-time totals
- **Checkout Flow**: Complete order flow with delivery scheduling
- **Location Selection**: Choose delivery locations with address management
- **Smooth Animations**: Fluid transitions and gestures powered by Reanimated
- **Tab Navigation**: Bottom tabs for easy navigation between sections

## Tech Stack

- [Expo Router](https://docs.expo.dev/routing/introduction/) - File-based routing and navigation
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Smooth animations and transitions
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) - Touch interactions
- [Expo Maps](https://docs.expo.dev/versions/latest/sdk/maps/) - Interactive maps integration
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) - Beautiful gradient effects
- [Zustand](https://zustand-demo.pmnd.rs/) - State management for cart and user data
- [MMKV](https://github.com/mrousavy/react-native-mmkv/tree/main) - The fastest key/value storage for React Native
- [Sentry](https://dub.sh/trysentry) - Error tracking and performance monitoring

## Video Tutorial

Watch and build this Wolt Clone step by step:

<p align="center">
  <a href="https://youtu.be/aYftPYZJsy8" target="_blank">
    <img src="https://img.youtube.com/vi/aYftPYZJsy8/maxresdefault.jpg" alt="Build a Wolt Clone with React Native" width="100%" />
  </a>
</p>

## Getting Started

### Prerequisites

Make sure you have the [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/) installed.

For the best development experience, install:

- [Android Studio](https://developer.android.com/studio) for Android development
- [Xcode](https://developer.apple.com/xcode/) (Mac only) for iOS development

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd wolt
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or npm install
   ```

3. **Prebuild the native code**

   ```bash
   bunx expo prebuild
   ```

4. **Run the app**

   ```bash
   # iOS
   bunx expo run:ios

   # Android
   bunx expo run:android
   ```

### Sentry Setup

1. Create a project on [Sentry](https://sentry.io/)
2. Run the setup wizard:

   ```bash
   bunx @sentry/wizard@latest -s -i reactNative
   ```

3. Follow the prompts to configure Sentry for your project

## Screenshots

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/1.png" width="200" style="margin: 10px;" alt="Welcome Screen">
<img src="./screenshots/2.png" width="200" style="margin: 10px;" alt="Authentication">
<img src="./screenshots/3.png" width="200" style="margin: 10px;" alt="Home Discovery">
<img src="./screenshots/4.png" width="200" style="margin: 10px;" alt="Restaurant List">
</div>

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/5.png" width="200" style="margin: 10px;" alt="Restaurant Details">
<img src="./screenshots/6.png" width="200" style="margin: 10px;" alt="Menu View">
<img src="./screenshots/7.png" width="200" style="margin: 10px;" alt="Item Details">
<img src="./screenshots/8.png" width="200" style="margin: 10px;" alt="Shopping Cart">
</div>

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/9.png" width="200" style="margin: 10px;" alt="Checkout">
<img src="./screenshots/10.png" width="200" style="margin: 10px;" alt="Profile">
<img src="./screenshots/11.png" width="200" style="margin: 10px;" alt="Search">
<img src="./screenshots/12.png" width="200" style="margin: 10px;" alt="Map View">
</div>

## Demo Videos

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/demo1.gif" width="200" style="margin: 10px;" alt="App Navigation">
<img src="./screenshots/demo2.gif" width="200" style="margin: 10px;" alt="Restaurant Browse">
<img src="./screenshots/demo3.gif" width="200" style="margin: 10px;" alt="Menu Interaction">
<img src="./screenshots/demo4.gif" width="200" style="margin: 10px;" alt="Cart Management">
</div>

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/demo5.gif" width="200" style="margin: 10px;" alt="Checkout Flow">
<img src="./screenshots/demo6.gif" width="200" style="margin: 10px;" alt="Search Feature">
<img src="./screenshots/demo7.gif" width="200" style="margin: 10px;" alt="Map Exploration">
</div>

## Monitoring with Sentry

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/sentry1.png" width="100%" style="margin: 10px;">
<img src="./screenshots/sentry2.png" width="100%" style="margin: 10px;">
<img src="./screenshots/sentry3.png" width="100%" style="margin: 10px;">
</div>

## Code Reviews with CodeRabbit

<div style="display: flex; flex-direction: 'row';">
<img src="./screenshots/cr1.png" width="100%" style="margin: 10px;">
<img src="./screenshots/cr2.png" width="100%" style="margin: 10px;">
</div>

## Project Structure

```
app/
├── (app)/
│   ├── (public)/          # Public routes (authentication)
│   └── (auth)/            # Protected routes
│       ├── (tabs)/        # Bottom tab navigation
│       │   ├── restaurants/  # Restaurant browsing
│       │   ├── stores/       # Store browsing
│       │   ├── search/       # Search functionality
│       │   ├── discovery/    # Discovery feed
│       │   └── profile/      # User profile
│       ├── (modal)/       # Modal screens
│       │   ├── location/     # Location picker
│       │   ├── filter/       # Filter options
│       │   ├── map/          # Map view
│       │   └── [id]/         # Restaurant/menu details
│       └── order/         # Order flow
│           ├── index/        # Cart view
│           ├── schedule/     # Delivery scheduling
│           └── checkout/     # Checkout
components/              # Reusable components
constants/              # Theme, colors, fonts
assets/                 # Images and static files
```

## Features Breakdown

### Authentication Flow

- Beautiful animated welcome screen with infinite scroll
- Apple and Google OAuth integration
- Alternative login options

### Discovery & Browse

- Categorized restaurant and store listings
- Horizontal scrolling sections
- Restaurant cards with ratings and delivery info
- Filter by cuisine, price range, and dietary preferences

### Restaurant & Menu

- Detailed restaurant information
- Menu organized by categories
- Item customization options
- Add to cart with quantity selection

### Cart & Checkout

- Persistent cart state with Zustand
- Item quantity management
- Real-time price calculations
- Delivery scheduling options
- Order summary and confirmation

### Additional Features

- Location-based restaurant discovery
- Interactive map with restaurant markers
- Search with autocomplete
- User profile management
- Smooth page transitions and animations

## Sponsors

### Sentry

[Sentry](https://dub.sh/trysentry) provides real-time error tracking and performance monitoring that helps developers see what actually matters, solve issues faster, and learn continuously about their applications.

### CodeRabbit

[CodeRabbit](https://coderabbit.link/simon) offers AI-powered code reviews that provide instant feedback, catch bugs early, and help maintain code quality across your entire team.

## 🚀 Learn More

**Take a shortcut from web developer to mobile development fluency with guided learning**

Enjoyed this project? Learn to use React Native to build production-ready, native mobile apps for both iOS and Android based on your existing web development skills.

<a href="https://galaxies.dev?utm_source=simongrimm&utm_medium=github&vid=pocket-clone"><img src="banner.png" height="auto" width="100%"></a>



Bundling the app for iOS
   npx expo run:ios

Bundling the app for Android
   npx expo run:android
   

Build for development (with native modules):
   eas build --profile development --platform ios
   # or
   eas build --profile development --platform android


Build for preview/testing
      eas build --profile preview --platform ios
   # or
   eas build --profile preview --platform android




Build for production
   eas build --profile production --platform ios
   # or
   eas build --profile production --platform android

OR

Build for production
   eas build --platform ios
   # or
   eas build --platform android




Build for testing on a real device
   eas build --profile test --platform ios
   # or
   eas build --profile test --platform android





#### Ios Apple Store Connect config
##### eas credentials
- ios
- production
- All: Set up all the required...
- Reuse this distribution cert...
- Generate a new Apple provisioning profile...
##### eas build -p ios
##### eas submit --platform ios
- Select a build from EAS
OR
##### eas build -p ios --auto-submit