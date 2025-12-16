// import axios from 'axios';

import axios from "axios";

// Base URLs - can be configured via environment variables
const MOVIE_API_URL = import.meta.env.VITE_MOVIE_API_URL || 'https://flame-affiliates-asp-alphabetical.trycloudflare.com';
const THEATRE_API_URL = import.meta.env.VITE_THEATRE_API_URL || 'https://antiques-anti-bring-vice.trycloudflare.com';
const BOOKING_API_URL = import.meta.env.VITE_BOOKING_API_URL || 'https://mean-decorating-less-excitement.trycloudflare.com';
const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:5004';

// https://user-services-567526779141.us-central1.run.app

// Axios interceptor to add JWT token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.url?.includes(USER_API_URL)) {
      // Only add token to UserService requests that need authentication
      // Check if this is a protected endpoint
      const protectedEndpoints = ['/users/', '/auth/'];
      const isProtected = protectedEndpoints.some(endpoint => 
        config.url?.includes(endpoint) && 
        (config.method === 'put' || config.method === 'delete')
      );
      
      if (isProtected || config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Movie {
  movie_id: number;
  name: string;
  genres: string[];
  runtime_minutes: number;
  release_date: string;
  rating: number;
  language: string;
  description?: string; // Optional as it might not be in the list view
  posterUrl?: string; // To be handled if backend doesn't provide it
}

export interface Showtime {
  showtime_id: number;
  movie_id: number;
  screen_id: number;
  start_time: string;
  price: number;
  seats_booked: number;
}

export interface Cinema {
  cinema_id: number;
  name: string;
}

export interface Theatre {
  theatre_id: number;
  cinema_id: number;
  name: string;
  address: string;
}

export interface Screen {
  screen_id: number;
  theatre_id: number;
  screen_number: string; // Changed to string to match backend model
  num_rows: number;
  num_cols: number;
}

export interface BookedSeat {
  row: number;
  col: number;
  status: string;
  booking_id: number;
}

export interface User {
  user_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  created_at: string;
}

export interface Booking {
  booking_id: number;
  user_id: number;
  showtime_id: number;
  payment_id?: number;
  booking_time: string;
  status: string;
  seats: BookedSeat[];
  created_at: string;
  updated_at: string;
}

// Mock Data removed to fix unused variable errors.


// Movie Service
export const movieApi = {
  getAll: async (filters?: { name?: string; genre?: string }) => {
    // REAL IMPLEMENTATION:
    
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.genre && filters.genre !== 'All Genres') params.append('genre', filters.genre);
    
    const response = await axios.get(`${MOVIE_API_URL}/movies`, { params });
    console.log(response.data);
    
    // Validate response structure
    const data = response.data;
    const isValidResponse = Array.isArray(data) || (data && Array.isArray(data.items));
    
    if (!isValidResponse) {
      throw new Error('Invalid API response format');
    }

    return data.items || data;
    

    // MOCK IMPLEMENTATION:
    // Simulate network delay
    // await new Promise(resolve => setTimeout(resolve, 500));
    
    // let filtered = [...MOCK_MOVIES];
    
    // if (filters?.name) {
    //   const term = filters.name.toLowerCase();
    //   filtered = filtered.filter(m => m.name.toLowerCase().includes(term));
    // }
    
    // if (filters?.genre && filters.genre !== 'All Genres') {
    //   filtered = filtered.filter(m => m.genres.includes(filters.genre!));
    // }
    
    // return filtered;
  },
  
  getById: async (id: string) => {
    // REAL IMPLEMENTATION:
    
    const response = await axios.get(`${MOVIE_API_URL}/movies/${id}`);
    return response.data;
    

    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 300));
    // const movie = MOCK_MOVIES.find(m => m.movie_id === Number(id));
    // if (!movie) throw new Error('Movie not found');
    // return movie;
  }
};

// Theatre Service
export const theatreApi = {
  getShowtimes: async (movieId: string) => {
    // REAL IMPLEMENTATION:
  
    const response = await axios.get(`${THEATRE_API_URL}/showtimes`, {
      params: { movie_id: movieId }
    });
    console.log("asf");
    
    console.log(response.data);
    return response.data;
    

    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 400));
    // return MOCK_SHOWTIMES.filter(s => s.movie_id === Number(movieId));
  },

  getShowtimeById: async (showtimeId: string) => {
    // REAL IMPLEMENTATION:

    const response = await axios.get(`${THEATRE_API_URL}/showtimes/${showtimeId}`);
    return response.data;


    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 300));
    // const showtime = MOCK_SHOWTIMES.find(s => s.showtime_id === Number(showtimeId));
    // if (!showtime) throw new Error('Showtime not found');
    // return showtime;
  },

  getScreen: async (screenId: number) => {
    // REAL IMPLEMENTATION:
    const response = await axios.get(`${THEATRE_API_URL}/screens/${screenId}`);
    console.log("Received screen data");
    console.log(response.data);
    
    return response.data;

    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 300));
    // const screen = MOCK_SCREENS[screenId];
    // if (!screen) throw new Error('Screen not found');
    // return screen;
  },

  getTheatre: async (theatreId: number) => {
    // REAL IMPLEMENTATION:

    const response = await axios.get(`${THEATRE_API_URL}/theatres/${theatreId}`);
    console.log("Received theatre data");
    console.log(response.data);
    
    return response.data;


    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 300));
    // const theatre = MOCK_THEATRES[theatreId];
    // if (!theatre) throw new Error('Theatre not found');
    // return theatre;
  },

  getCinema: async (cinemaId: number) => {
    // REAL IMPLEMENTATION:
    const response = await axios.get(`${THEATRE_API_URL}/cinemas/${cinemaId}`);
    console.log("Received cinema data");
    console.log(response.data);
    
    return response.data;

    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 300));
    // const cinema = MOCK_CINEMAS.find(c => c.cinema_id === cinemaId);
    // if (!cinema) throw new Error('Cinema not found');
    // return cinema;
  }
};

// Booking Service
export const bookingApi = {
  getBookedSeats: async (showtimeId: string) => {
    // REAL IMPLEMENTATION:

    const response = await axios.get(`${BOOKING_API_URL}/api/bookings/showtime/${showtimeId}/seats`);
    console.log("Received booked seats data");
    console.log(response.data);
    return response.data.seats;
    

    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 300));
    // // Return random subset of booked seats for variety if needed, 
    // // or just static list for now.
    // // Let's make it deterministic based on showtimeId to look real
    // if (Number(showtimeId) % 2 === 0) {
    //     return MOCK_BOOKED_SEATS;
    // }
    // return [
    //     { row: 2, col: 2, status: 'booked', booking_id: 10 },
    //     { row: 2, col: 3, status: 'booked', booking_id: 10 },
    //     { row: 3, col: 4, status: 'booked', booking_id: 11 }
    // ];
  },

  createBooking: async (bookingData: {
    user_id: number;
    showtime_id: number;
    seats: { row: number; col: number }[];
  }) => {
    // REAL IMPLEMENTATION:
    const response = await axios.post(`${BOOKING_API_URL}/api/bookings/`, bookingData);
    console.log("Received booking data");
    console.log(response.data);
    return response.data;
    

    // MOCK IMPLEMENTATION:
    // await new Promise(resolve => setTimeout(resolve, 800));
    // console.log('Mock Booking Created:', bookingData);
    // return {
    //     booking_id: Math.floor(Math.random() * 10000),
    //     status: 'confirmed',
    //     message: 'Booking created successfully (MOCK)'
    // };
  },

  getUserBookings: async (userId: number) => {
    // REAL IMPLEMENTATION:
    const response = await axios.get(`${BOOKING_API_URL}/api/bookings/user/${userId}`);
    console.log("Received user bookings");
    console.log(response.data);
    return response.data.bookings;
  },

  getBooking: async (bookingId: number) => {
    const response = await axios.get(`${BOOKING_API_URL}/api/bookings/${bookingId}`);
    return response.data.booking;
  }
};

// User Service
export const userApi = {
  googleLogin: async (redirectUri?: string) => {
    const params = redirectUri ? { redirect_uri: redirectUri } : {};
    const response = await axios.get(`${USER_API_URL}/auth/google/login`, { params });
    return response.data;
  },

  googleOAuthCallback: async (code: string, redirectUri?: string) => {
    const params: any = { code };
    if (redirectUri) {
      params.redirect_uri = redirectUri;
    }
    const response = await axios.get(`${USER_API_URL}/auth/google/callback`, { params });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await axios.post(`${USER_API_URL}/auth/token`, null, {
      params: { email, password }
    });
    return response.data;
  },

  getProfile: async (userId: number, token?: string) => {
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` }
    } : {};
    const response = await axios.get(`${USER_API_URL}/users/${userId}`, config);
    console.log("Received user profile");
    console.log(response.data);
    return response.data;
  },
  
  updateProfile: async (userId: number, data: Partial<User>, token: string) => {
    const response = await axios.put(
      `${USER_API_URL}/users/${userId}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  }
};
