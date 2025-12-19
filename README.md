# Theatre_UI - Movie Booking Frontend

A modern React single-page application (SPA) for the movie theatre booking platform, built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

## 🚀 Features

- ✅ Google OAuth authentication
- ✅ Movie browsing and search
- ✅ Interactive seat selection
- ✅ Booking management
- ✅ User profile management
- ✅ Responsive design with Tailwind CSS
- ✅ Hash-based routing for static hosting
- ✅ Real-time API integration with microservices

## 📋 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** (HashRouter) - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library

## 📁 Project Structure

```
Theatre_UI/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── ProtectedRoute.tsx  # Route protection
│   │   └── ui/             # UI components (Button, etc.)
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Movie browsing
│   │   ├── Login.tsx       # OAuth login
│   │   ├── MoviePage.tsx   # Movie details
│   │   ├── SeatSelection.tsx  # Seat booking
│   │   ├── MyBookings.tsx  # Booking history
│   │   └── UserProfile.tsx # User profile
│   ├── services/
│   │   └── api.ts          # API client configuration
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── dist/                   # Build output (for deployment)
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Create `.env` file (optional, defaults provided):
```bash
VITE_MOVIE_API_URL=https://your-movie-service-url
VITE_THEATRE_API_URL=https://your-theatre-service-url
VITE_BOOKING_API_URL=https://your-booking-service-url
VITE_USER_API_URL=https://your-user-service-url
```

3. **Run development server:**
```bash
npm run dev
```

The app will start on `http://localhost:5173`

## 🏗️ Build

### Development Build
```bash
npm run build
```

Build output will be in the `dist/` directory.

### Production Build
The same command creates a production-optimized build:
```bash
npm run build
```

## 📦 Deployment

### Google Cloud Storage (Current Setup)

The frontend is deployed as a static website on Google Cloud Storage:

#### Deployment Steps

1. **Build the project:**
```bash
npm run build
```

2. **Upload to Cloud Storage:**
```bash
# Sync files (deletes old files)
gsutil -m rsync -r -d dist gs://blue-cloud-movies

# Set correct MIME types
noglob gsutil -m setmeta -h "Content-Type:application/javascript" gs://blue-cloud-movies/assets/*.js
noglob gsutil -m setmeta -h "Content-Type:text/css" gs://blue-cloud-movies/assets/*.css
noglob gsutil -m setmeta -h "Content-Type:text/html" gs://blue-cloud-movies/*.html
noglob gsutil -m setmeta -h "Content-Type:image/svg+xml" gs://blue-cloud-movies/*.svg

# Enable website hosting (run once)
gsutil web set -m index.html -e index.html gs://blue-cloud-movies

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://blue-cloud-movies
```

3. **Access your site:**
```
https://storage.googleapis.com/blue-cloud-movies/index.html
```

#### Hash-based Routing

The app uses **HashRouter** instead of BrowserRouter to support static hosting:

- Routes use hash fragments: `#/login`, `#/`, `#/movie/123`
- Works perfectly with Cloud Storage (no server-side routing needed)
- Example: `https://storage.googleapis.com/blue-cloud-movies/index.html#/login`

#### Vite Configuration

The `vite.config.ts` is configured for relative paths:
```typescript
export default defineConfig({
  plugins: [react()],
  base: "./", // Relative paths for static hosting
})
```

## 🔌 API Integration

The app integrates with four microservices:

1. **User Service** - Authentication and user profiles
   - Google OAuth flow
   - JWT token management
   - User profile CRUD

2. **Movie Service** - Movie catalog
   - List movies with filters
   - Movie details
   - Genre management

3. **Theatre Service** - Showtimes and screens
   - Showtime listing
   - Screen details
   - Theatre information

4. **Booking Service** - Bookings and payments
   - Create bookings (202 Accepted - async)
   - Seat availability checking
   - Booking history
   - Payment processing (201 Created - sync)

### API Client Configuration

API URLs are configured in `src/services/api.ts`:
- Can be overridden via environment variables
- Defaults to cloudflared URLs for development
- Production URLs should be set in environment variables

## 🔐 Authentication Flow

1. User clicks "Continue with Google"
2. Frontend calls `GET /auth/google/login`
3. User redirected to Google OAuth
4. Google redirects back with authorization code
5. Frontend calls `GET /auth/google/callback?code=...`
6. Service returns JWT token and user info
7. Frontend stores JWT in localStorage
8. Protected routes check authentication via `AuthContext`

### Protected Routes

Routes protected by authentication:
- `/` (Dashboard)
- `/movie/:id` (Movie details)
- `/booking/:showtimeId` (Seat selection)
- `/bookings` (My bookings)
- `/profile` (User profile)

## 📱 Pages

### Dashboard (`/`)
- Browse all movies
- Search by name
- Filter by genre
- Navigate to movie details

### Movie Page (`/movie/:id`)
- Movie details
- Available showtimes
- Navigate to seat selection

### Seat Selection (`/booking/:showtimeId`)
- Interactive seat map
- Select multiple seats
- View booked/available seats
- Create booking (202 Accepted)

### My Bookings (`/bookings`)
- View booking history
- See booking status
- View booked seats

### User Profile (`/profile`)
- View user information
- Update profile (PUT /users/{id})
- Logout

### Login (`/login`)
- Google OAuth authentication
- Handle OAuth callback
- Redirect to dashboard after login

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- Responsive design (mobile-first)
- Dark theme for navbar
- Light theme for content

## 🧪 Development

### Run Development Server
```bash
npm run dev
```

### Lint
```bash
npm run lint
```

### Preview Production Build
```bash
npm run build
npm run preview
```

## ⚠️ Important Notes

### Hash Routing
- Uses `HashRouter` instead of `BrowserRouter` for Cloud Storage compatibility
- All routes must use hash fragments (`#/...`)
- Google OAuth redirect URIs should not include hash (handled automatically)

### Asset Paths
- Built with relative paths (`./assets/...`) for static hosting
- MIME types must be set correctly in Cloud Storage

### CORS
- All microservices must have CORS enabled for the frontend origin
- Cloud Storage origin: `https://storage.googleapis.com`


## 📝 Environment Variables

```bash
# API URLs (optional, defaults to cloudflared URLs)
VITE_MOVIE_API_URL=https://your-movie-service-url
VITE_THEATRE_API_URL=https://your-theatre-service-url
VITE_BOOKING_API_URL=https://your-booking-service-url
VITE_USER_API_URL=https://your-user-service-url
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloud Storage
gsutil -m rsync -r -d dist gs://blue-cloud-movies
```

---

**Built with React + TypeScript + Vite** ⚡ | **Version 0.0.0**

For API documentation, see the individual microservice READMEs.
