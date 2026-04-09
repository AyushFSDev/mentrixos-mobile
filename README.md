#  MentrixOS Mobile App

##  Overview
MentrixOS is a React Native mobile application designed to provide secure authentication and role-based access for institute management systems.

---

##  Features Implemented

-  Authentication Flow
  - Login using Phone / Email
  - OTP Verification
  - Password Login

-  Institute Selection
  - Multiple institute handling
  - Search & filter support

-  Role Selection
  - Role-based access system
  - Dynamic role icons support

-  Dashboard
  - User-specific dashboard
  - Stats cards with skeleton loaders

-  UI/UX
  - Clean Apple-style design
  - Light & Dark theme support
  - Responsive layout (mobile + tablet)

-  System Improvements
  - Navigation reset handling
  - Back navigation control
  - Error handling & loading states

---

##  Architecture (Current)

- Context API for state management
- Modular component structure
- API integration with service layer (partial)
- AsyncStorage for token handling

---

##  Work In Progress

-  Language (i18n) support
-  Service layer separation (auth, dashboard, etc.)
-  Secure storage for tokens (Keychain/Encrypted storage)
-  API retry & timeout handling

---

##  Tech Stack

- React Native (0.84)
- React Navigation
- Context API
- AsyncStorage
- React Native Vector Icons
- React Native SVG

---

##  Setup Instructions

```bash
npm install
npx react-native run-android
# or
npx react-native run-ios
