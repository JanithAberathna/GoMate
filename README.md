# GoMate - Swiss Travel & Transport Mobile Application

A modern React Native mobile application built with Expo for exploring Swiss destinations and managing travel preferences with real-time Swiss transport data.

## 📱 Project Overview

GoMate is a feature-rich Swiss travel and transport application that allows users to:
- Browse real Swiss destinations with live transport data
- View detailed destination and connection information
- Save favorite Swiss locations
- Manage user profiles
- Toggle dark mode theme
- Authenticate securely
- Experience modern glassmorphic UI design

## 🎯 Key Features

### ✅ User Authentication
- **Login & Registration**: Complete user authentication flow with form validation
- **Secure Storage**: User credentials stored securely using AsyncStorage
- **Session Management**: Automatic session restoration on app restart
- **Form Validation**: Using Yup schema validation for email, username, and password
- **Demo Credentials**: 
  - Username: `emilys`
  - Password: `emilyspass`

### ✅ Navigation Structure
- **Stack Navigation**: For authentication and detail screens
- **Bottom Tab Navigation**: Three main tabs (Home, Favorites, Profile)
- **Expo Router**: File-based routing for seamless navigation
- **Protected Routes**: Authentication-based route protection

### ✅ Home Screen (Dynamic Item List)
- **Swiss Transport API Integration**: Fetches real-time data from transport.opendata.ch
- **15 Swiss Destinations**: Zurich, Geneva, Basel, Bern, Lausanne, Lucerne, Lugano, St. Gallen, Interlaken, Zermatt, Montreux, Grindelwald, Davos, Locarno, Thun
- **Modern Glassmorphic Cards**: Each destination displayed with:
  - Location-specific high-quality images
  - Station name and next departure time
  - Transport type badges (train, bus, tram)
  - Real connection data with duration and platform
  - Favorite toggle button
  - Elevated shadows and rounded corners
- **Search Functionality**: Real-time search by station name or location
- **Pull-to-Refresh**: Swipe down to reload live transport data

### ✅ Details Screen
- **Comprehensive Information**: Full destination details including:
  - Large hero image
  - Rating and status
  - Location and category
  - Detailed description
  - Price information
  - Features list
- **Interactive Elements**: 
  - Back navigation
  - Favorite toggle
  - Book Now button
- **Responsive Design**: Adapts to different screen sizes

### ✅ Favorites System
- **Add/Remove Favorites**: Toggle favorites from home or details screen
- **Persistent Storage**: Favorites saved using AsyncStorage
- **Dedicated Favorites Screen**: View all saved destinations
- **Empty State**: Encouraging UI when no favorites exist

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

### 🎁 Bonus Features
- **Real Swiss Transport Data**: Live connections from Swiss Transport API (transport.opendata.ch)
- **Modern Glassmorphic UI**: Contemporary design with elevated shadows and blur effects
- **Swiss Design System**: Complete color palette inspired by Swiss national identity
- **Location-Specific Images**: High-quality Swiss station and landscape imagery
- **Dark Mode Toggle**: Persistent theme preference with smooth transitions
- **Search Functionality**: Real-time destination filtering
- **Pull-to-Refresh**: Manual data refresh capability
- **Safe Area Handling**: Proper status bar integration using react-native-safe-area-context
- **Empty States**: User-friendly messages for empty lists
- **User Stats**: Display favorites count in profile
- **Loading States**: Activity indicators during async operations
- **Responsive Typography**: Bold weights (700-800) with optimized letter spacing

## 🏗️ Project Structure

```
GoMate/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── home.tsx              # Home screen with destinations
│   │   ├── favorites.tsx         # Favorites screen
│   │   ├── profile.tsx           # User profile screen
│   │   └── index.tsx             # Redirect to home
│   ├── auth/
│   │   ├── login.tsx             # Login screen
│   │   └── register.tsx          # Registration screen
│   ├── details/
│   │   └── [id].tsx              # Dynamic destination details
│   └── _layout.tsx               # Root layout with Redux Provider
├── store/
│   ├── index.ts                  # Redux store configuration
│   ├── hooks.ts                  # Typed Redux hooks
│   └── slices/
│       ├── authSlice.ts          # Authentication state
│       ├── destinationsSlice.ts  # Destinations data
│       ├── favoritesSlice.ts     # Favorites management
│       └── themeSlice.ts         # Theme preference
├── components/                   # Reusable UI components
├── constants/                    # App constants and theme
└── hooks/                        # Custom React hooks
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

- **Username**: `user`
- **Password**: `user123`

## 🌐 API Integration

The app uses the following public APIs:

- **Swiss Transport API**: https://transport.opendata.ch/v1/ (No API key required)
  - `/locations`: Search for Swiss stations and locations
  - `/connections`: Get real-time connection data between stations
- **Authentication**: https://dummyjson.com/auth/login
- **User Registration**: https://dummyjson.com/users/add
- **Station Images**: Unsplash API with location-specific Swiss imagery

## 📱 Key Screens

1. **Login Screen**: User authentication with validation
2. **Register Screen**: New user registration
3. **Home Screen**: Browse all destinations with search
4. **Details Screen**: View complete destination information
5. **Favorites Screen**: Manage saved destinations
6. **Profile Screen**: User information and settings

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

- Real-time train tracking with GPS
- Offline mode with cached transport schedules
- Push notifications for delays and platform changes
- Swiss Travel Pass integration
- Ticket booking functionality
- Multi-language support (German, French, Italian, English)
- Interactive maps with station locations
- Journey planning with multiple connections
- Price comparison for different routes
- Weather integration for Swiss locations

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
