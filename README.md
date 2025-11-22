# GoMate - Travel & Transport Mobile Application

A comprehensive React Native mobile application built with Expo for exploring destinations and managing travel preferences.

## 📱 Project Overview

GoMate is a feature-rich travel and transport application that allows users to:
- Browse and search travel destinations
- View detailed destination information
- Save favorite destinations
- Manage user profiles
- Toggle dark mode theme
- Authenticate securely

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
- **API Integration**: Fetches destinations from DummyJSON API
- **Card-Based UI**: Each destination displayed with:
  - High-quality image
  - Title and description
  - Location with map pin icon
  - Status badge (Active/Limited/Unavailable)
  - Star rating
  - Favorite toggle button
- **Search Functionality**: Real-time search by name, location, or category
- **Pull-to-Refresh**: Swipe down to reload destinations

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
- **Feather Icons**: Consistent iconography throughout
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on various screen sizes
- **Smooth Animations**: Native feel with haptic feedback
- **Color Scheme**: Professional blue (#007AFF) primary color
- **Status Colors**: 
  - Active: Green (#34c759)
  - Limited: Orange (#ff9500)
  - Unavailable: Red (#ff3b30)

### 🎁 Bonus Features
- **Dark Mode Toggle**: Persistent theme preference with smooth transitions
- **Search Functionality**: Real-time destination filtering
- **Pull-to-Refresh**: Manual data refresh capability
- **Empty States**: User-friendly messages for empty lists
- **User Stats**: Display favorites count in profile
- **Loading States**: Activity indicators during async operations

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
- **Expo Router**: ~6.0.15 (Navigation)
- **Redux Toolkit**: ^2.5.0 (State Management)
- **React Redux**: ^9.2.0
- **AsyncStorage**: ^2.2.0 (Data Persistence)
- **Axios**: ^1.7.9 (HTTP Client)
- **Formik**: ^2.4.6 (Form Management)
- **Yup**: ^1.6.1 (Form Validation)
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

- **Authentication**: https://dummyjson.com/auth/login
- **User Registration**: https://dummyjson.com/users/add
- **Destinations Data**: https://dummyjson.com/products

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

- Offline mode support
- Push notifications
- Social sharing
- Reviews and ratings
- Booking functionality
- Multi-language support
- Maps integration

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
