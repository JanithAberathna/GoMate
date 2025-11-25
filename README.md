# GoMate - Swiss Travel & Transport Mobile Application

A modern React Native mobile application built with Expo for exploring Swiss public transport schedules, planning journeys, and managing travel preferences with real-time data from the Swiss Transport API.

## 📱 Project Overview

GoMate is a comprehensive Swiss travel and transport application that provides:
- **Real-time Swiss train schedules** - Live departure times from major Swiss stations
- **Journey planning** - Search connections between any two Swiss stations
- **Destination exploration** - Browse 15 major Swiss transport hubs
- **Favorites management** - Save your frequently used stations
- **User authentication** - Secure login and registration
- **Dark mode support** - Toggle between light and dark themes
- **Modern UI design** - Swiss Design-inspired interface with glassmorphic elements

## 🎯 Key Features

### ✅ User Authentication
- **Login & Registration**: Complete user authentication flow with form validation
- **DummyJSON API Integration**: Secure authentication using https://dummyjson.com/auth/login
- **Secure Storage**: User credentials and session stored using AsyncStorage
- **Session Management**: Automatic session restoration on app restart
- **Form Validation**: Yup schema validation for email, username, and password
- **Demo Credentials**: 
  - Username: `emilys`
  - Password: `emilyspass`
- **Personalized Experience**: User's name displayed throughout the app

### ✅ Navigation Structure
- **Expo Router**: Modern file-based routing system
- **Stack Navigation**: For authentication, details, and journey planning
- **Bottom Tab Navigation**: Five main tabs (Index, Home, Explore, Favorites, Profile)
- **Protected Routes**: Authentication-based route protection
- **Deep Linking**: Direct navigation to specific screens
- **Web Support**: Responsive design with 480px centered container

### ✅ Home Screen (Dynamic Item List)
- **Swiss Transport API Integration**: Live data from transport.opendata.ch (no API key required)
- **15 Major Swiss Stations**: Zurich HB, Geneva, Basel SBB, Bern, Lausanne, Lucerne, Lugano, St. Gallen, Winterthur, Biel/Bienne, Thun, Köniz, La Chaux-de-Fonds, Schaffhausen, Fribourg
- **Attractive Modern Cards** with:
  - Large station images (32% screen height)
  - Bold typography (800 font weight)
  - Next 3 departure times in highlighted badge
  - Location and operating status
  - Favorite toggle with heart icon
  - Swiss Red shadows and 24px border radius
- **Dynamic Station Search**: Search any Swiss station with real-time suggestions
- **Pull-to-Refresh**: Swipe down to reload live departure data
- **Journey Planner Button**: Quick access to connection search
- **Performance Optimized**: No delays, instant navigation

### ✅ Details Screen (Real-time Departures)
- **Live Departure Board**: Shows all trains from current time to end of day
- **Comprehensive Train Information**:
  - Departure time (large, Swiss Red)
  - Train type with full name (e.g., "IC 715" - "InterCity")
  - Destination station with arrow indicator
  - Platform number
- **Departure Cards**: Modern cards with:
  - Time filtering (only future departures today)
  - Train category badges (IC, S, RE, etc.)
  - Full train type names for user understanding
  - Platform and destination details
- **Station Information**:
  - Hero image and location
  - Description and facilities
  - Rating and status
- **Interactive Elements**:
  - Back navigation
  - Favorite toggle
  - Scrollable departure list with bottom margin

### ✅ Favorites System
- **Add/Remove Favorites**: Toggle from home or details screen with heart icon
- **Persistent Storage**: Favorites saved using AsyncStorage via Redux
- **Dedicated Favorites Screen**: Horizontal card layout with:
  - Station images (130px width, 160px height)
  - Station name and location
  - Rating display
  - Status badge
  - Quick remove button
- **Proper Spacing**: 100px bottom padding for tab bar clearance
- **Empty State**: Friendly message when no favorites exist

### ✅ State Management (Redux Toolkit)
- **Authentication State**: User session and auth status
- **Destinations State**: API data and selected destination
- **Favorites State**: User's favorite destinations
- **Theme State**: Dark mode preference
- **Async Actions**: Thunks for API calls and storage operations

### ✅ Styling & UI/UX
- **Modern Design Era**: Contemporary glassmorphism with elevated shadows
- **Swiss Design Color Palette**: 
  - Primary: Swiss Red (#D52B1E)
  - Accent: Transport Blue (#005BBB)
  - Secondary: Alpine Green (#2F8F4E)
  - Background: Swiss White (#F7F7F7)
  - Text: Neutral Charcoal (#1C1C1C)
  - Warning: Caution Yellow (#FFB300)
- **Feather Icons**: Consistent iconography throughout
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Responsive Design**: Works on various screen sizes using Dimensions API
- **Smooth Animations**: Native feel with haptic feedback
- **Bold Typography**: 700-800 font weights with negative letter spacing
- **Rounded Corners**: 20px border radius for modern aesthetic
- **Glassmorphic Effects**: Semi-transparent backgrounds with backdrop blur
- **Elevated Shadows**: Multi-layer shadows for depth (6-16px)

### ✨ Journey Planning Feature
- **Connection Search**: Find routes between any two Swiss stations
- **Input Fields**: From/To station with swap button
- **Rich Connection Data**:
  - Up to 10 connection options
  - Departure and arrival times
  - Travel duration (formatted as hours, minutes, seconds)
  - Number of transfers with badge
  - Platform information
  - Complete train sequence (e.g., "IC 715 → S 3 → RE 456")
  - Full train type names (e.g., "InterCity → S-Bahn → Regional Express")
- **User-Friendly Display**:
  - Train codes with full names for easy understanding
  - Transfer count visualization
  - Connection cards with all journey details
- **Error Handling**: Clear messages for invalid stations
- **Bottom Spacing**: Proper margin for scrollable content

### 🎁 Bonus Features
- **Real-time Swiss Transport Data**: 40+ departures per station from transport.opendata.ch
- **Journey Planner**: Search connections between any Swiss stations with full route details
- **Modern Glassmorphic UI**: Contemporary design with elevated shadows (8-20px)
- **Swiss Design System**: Authentic color palette (Swiss Red #D52B1E, Transport Blue, Alpine Green)
- **Train Type Education**: Shows both codes and full names (IC = InterCity, S = S-Bahn)
- **Dark Mode Toggle**: System-wide theme with persistent preference
- **Dynamic Search**: Search any Swiss station, not limited to defaults
- **Web Responsive**: 480px centered container for web browsers
- **Safe Area Handling**: Perfect status bar integration with react-native-safe-area-context
- **Performance Optimized**: No artificial delays, instant data loading
- **Time Filtering**: Only shows relevant departures (current time to end of day)
- **Fallback Handling**: Graceful error handling with fallback data
- **Loading States**: Smooth loading indicators for async operations
- **Bold Typography**: 700-800 font weights with -0.5 letter spacing

## 🏗️ Project Structure

```
GoMate/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab navigation
│   │   ├── index.tsx             # Tab 1: Index screen
│   │   ├── home.tsx              # Tab 2: Home with stations
│   │   ├── explore.tsx           # Tab 3: Explore screen
│   │   ├── favorites.tsx         # Tab 4: Saved stations
│   │   └── profile.tsx           # Tab 5: User profile
│   ├── auth/
│   │   ├── login.tsx             # Login with DummyJSON API
│   │   └── register.tsx          # Registration screen
│   ├── details/
│   │   └── [id].tsx              # Station details with departures
│   ├── journey/
│   │   └── plan.tsx              # Journey planner (NEW)
│   └── _layout.tsx               # Root layout with Redux & web support
├── store/
│   ├── index.ts                  # Redux store with AsyncStorage
│   ├── hooks.ts                  # Typed useAppDispatch/useAppSelector
│   └── slices/
│       ├── authSlice.ts          # Auth state with DummyJSON
│       ├── destinationsSlice.ts  # Swiss Transport API data
│       ├── favoritesSlice.ts     # Favorites with AsyncStorage
│       └── themeSlice.ts         # Dark mode preference
├── constants/
│   └── theme.ts                  # Swiss Design color palette
├── components/                    # Reusable UI components
└── hooks/                         # Custom React hooks
```

## 🛠️ Technologies Used

- **React Native**: ^0.81.5
- **Expo**: ~54.0.25
- **Expo Router**: ~6.0.15 (File-based Navigation)
- **Redux Toolkit**: ^2.10.1 (State Management)
- **React Redux**: ^9.2.0
- **AsyncStorage**: ^2.2.0 (Data Persistence)
- **Axios**: ^1.13.2 (HTTP Client for Swiss Transport API)
- **Formik**: ^2.4.9 (Form Management)
- **Yup**: ^1.7.1 (Form Validation)
- **React Native Safe Area Context**: ~5.6.0 (Status bar handling)
- **Feather Icons**: @expo/vector-icons
- **TypeScript**: ~5.9.2

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GoMate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera (iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## 🔑 Demo Credentials

Use these credentials to test the application:

- **Username**: `emilys`
- **Password**: `emilyspass`

This will log you in as **Emily Johnson** with access to all features.

## 🌐 API Integration

The app uses the following public APIs:

### Swiss Transport API (https://transport.opendata.ch/v1/)
- **No API key required** - Open data from Swiss Federal Railways
- **Endpoints used**:
  - `/locations?query={station}&type=station` - Search stations
  - `/stationboard?station={name}&limit=40` - Get departures (40 trains)
  - `/connections?from={station}&to={station}&limit=10` - Journey planning
- **Data includes**: Real-time departures, train types, destinations, platforms, durations

### DummyJSON API (https://dummyjson.com/)
- **Authentication**: POST `/auth/login` - User login with emilys/emilyspass
- **Returns**: User data (Emily Johnson), access token
- **User Registration**: POST `/users/add` - New user creation

### Images
- **Unsplash**: High-quality Swiss landscape and cityscape images
- **Station-specific**: Unique images for each of 15 major stations

## 📱 Key Screens

1. **Login Screen**: DummyJSON authentication with Formik + Yup validation
2. **Register Screen**: New user registration with form validation
3. **Home Screen**: 15 Swiss stations with search, favorites, and journey planner access
4. **Details Screen**: Real-time departure board showing all trains from now to end of day
5. **Journey Planner**: Search connections between any two stations with full route details
6. **Favorites Screen**: Horizontal cards with saved stations (160px height)
7. **Profile Screen**: User info, stats, dark mode toggle, and logout
8. **Explore Screen**: Additional discovery features (tab 3)
9. **Index Screen**: Entry point with navigation (tab 1)

## ✨ Best Practices Implemented

- **TypeScript**: Full type safety throughout the application
- **Redux Toolkit**: Modern Redux with slices and thunks
- **Async Storage**: Secure local data persistence
- **Form Validation**: Yup schemas for robust validation
- **Code Organization**: Feature-based folder structure
- **Reusable Components**: DRY principle followed
- **Error Handling**: Comprehensive error states and messages
- **Loading States**: User feedback during async operations
- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode Support**: System-wide theme consistency

## 🎨 Design Principles

- Clean and modern UI
- Consistent spacing and typography
- Intuitive navigation patterns
- Accessible color contrasts
- Meaningful animations
- User feedback on all interactions

## 📊 State Management Flow

```
User Action → Dispatch Action → Redux Thunk → API Call/Storage
                    ↓
              State Update
                    ↓
          UI Re-renders with New Data
```

## 🔐 Security Features

- Secure token storage using AsyncStorage
- Password visibility toggle
- Session management
- Protected routes
- Input validation and sanitization

## 🚀 Future Enhancements

- Real-time train tracking with GPS and live map
- Offline mode with cached transport schedules
- Push notifications for delays and platform changes
- Swiss Travel Pass integration and digital ticket storage
- Ticket booking and payment functionality
- Multi-language support (German, French, Italian, Romansh, English)
- Interactive maps with station locations and navigation
- Price comparison for different routes and transport options
- Weather integration for Swiss locations
- Accessibility features (screen reader, high contrast)
- Apple Watch and Android Wear companion apps
- QR code scanning for quick station lookup
- Travel history and statistics

## 👨‍💻 Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## 📝 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- DummyJSON for providing free API endpoints
- Expo team for the amazing framework
- React Native community for continuous support

---

**Built with ❤️ using React Native & Expo**
