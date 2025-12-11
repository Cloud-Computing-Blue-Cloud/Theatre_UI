// import axios from 'axios';

import axios from "axios";

// Base URLs - can be configured via environment variables
const MOVIE_API_URL = import.meta.env.VITE_MOVIE_API_URL || '';
// const THEATRE_API_URL = import.meta.env.VITE_THEATRE_API_URL || 'http://localhost:8003';
// const BOOKING_API_URL = import.meta.env.VITE_BOOKING_API_URL || 'http://localhost:5003';
// const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8001';

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

// Mock Data
const MOCK_MOVIES: Movie[] = [
  {
    movie_id: 1,
    name: 'Inception',
    genres: ['Sci-Fi', 'Action'],
    runtime_minutes: 148,
    release_date: '2010-07-16',
    rating: 8.8,
    language: 'English',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop'
  },
  {
    movie_id: 2,
    name: 'The Dark Knight',
    genres: ['Action', 'Crime'],
    runtime_minutes: 152,
    release_date: '2008-07-18',
    rating: 9.0,
    language: 'English',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=800&auto=format&fit=crop'
  },
  {
    movie_id: 3,
    name: 'Interstellar',
    genres: ['Sci-Fi', 'Adventure'],
    runtime_minutes: 169,
    release_date: '2014-11-07',
    rating: 8.6,
    language: 'English',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop'
  },
  {
    movie_id: 4,
    name: 'Dune: Part Two',
    genres: ['Sci-Fi', 'Adventure'],
    runtime_minutes: 166,
    release_date: '2024-03-01',
    rating: 8.9,
    language: 'English',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    posterUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop'
  }
];

const MOCK_CINEMAS: Cinema[] = [
  { cinema_id: 1, name: 'AMC Theatres' },
  { cinema_id: 2, name: 'Regal Cinemas' }
];

const MOCK_THEATRES: Record<number, Theatre> = {
  1: { theatre_id: 1, cinema_id: 1, name: 'AMC Empire 25', address: '234 W 42nd St, New York, NY' },
  2: { theatre_id: 2, cinema_id: 1, name: 'AMC Lincoln Square', address: '1998 Broadway, New York, NY' },
  3: { theatre_id: 3, cinema_id: 2, name: 'Regal Union Square', address: '850 Broadway, New York, NY' }
};

const MOCK_SCREENS: Record<number, Screen> = {
  1: { screen_id: 1, theatre_id: 1, screen_number: '1', num_rows: 8, num_cols: 10 },
  2: { screen_id: 2, theatre_id: 1, screen_number: '2', num_rows: 10, num_cols: 12 },
  3: { screen_id: 3, theatre_id: 2, screen_number: 'IMAX', num_rows: 15, num_cols: 20 },
  4: { screen_id: 4, theatre_id: 3, screen_number: '1', num_rows: 8, num_cols: 10 },
  5: { screen_id: 5, theatre_id: 3, screen_number: '2', num_rows: 8, num_cols: 10 }
};

const MOCK_SHOWTIMES: Showtime[] = [
  // AMC Empire 25 (Screen 1 & 2)
  { showtime_id: 101, movie_id: 1, screen_id: 1, start_time: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(), price: 12.50, seats_booked: 5 },
  { showtime_id: 102, movie_id: 1, screen_id: 1, start_time: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(), price: 12.50, seats_booked: 12 },
  { showtime_id: 103, movie_id: 1, screen_id: 2, start_time: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(), price: 15.00, seats_booked: 45 },
  
  // AMC Lincoln Square (Screen 3 - IMAX)
  { showtime_id: 104, movie_id: 2, screen_id: 3, start_time: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(), price: 22.50, seats_booked: 8 },
  { showtime_id: 105, movie_id: 2, screen_id: 3, start_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), price: 22.50, seats_booked: 20 },
  
  // Regal Union Square (Screen 4 & 5)
  { showtime_id: 106, movie_id: 2, screen_id: 4, start_time: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(), price: 15.00, seats_booked: 80 },
  { showtime_id: 107, movie_id: 3, screen_id: 5, start_time: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(), price: 12.50, seats_booked: 15 },
  { showtime_id: 108, movie_id: 4, screen_id: 4, start_time: new Date(new Date().setHours(16, 30, 0, 0)).toISOString(), price: 14.00, seats_booked: 30 }
];

const MOCK_BOOKED_SEATS: BookedSeat[] = [
  { row: 1, col: 2, status: 'booked', booking_id: 1 },
  { row: 1, col: 3, status: 'booked', booking_id: 1 },
  { row: 4, col: 5, status: 'booked', booking_id: 2 },
  { row: 4, col: 6, status: 'booked', booking_id: 2 },
  { row: 5, col: 5, status: 'booked', booking_id: 3 }
];

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
    /*
    const response = await axios.get(`${MOVIE_API_URL}/movies/${id}`);
    return response.data;
    */

    // MOCK IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 300));
    const movie = MOCK_MOVIES.find(m => m.movie_id === Number(id));
    if (!movie) throw new Error('Movie not found');
    return movie;
  }
};

// Theatre Service
export const theatreApi = {
  getShowtimes: async (movieId: string) => {
    // REAL IMPLEMENTATION:
    /*
    const response = await axios.get(`${THEATRE_API_URL}/showtimes`, {
      params: { movie_id: movieId }
    });
    return response.data;
    */

    // MOCK IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_SHOWTIMES.filter(s => s.movie_id === Number(movieId));
  },

  getShowtimeById: async (showtimeId: string) => {
    // REAL IMPLEMENTATION:
    /*
    const response = await axios.get(`${THEATRE_API_URL}/showtimes/${showtimeId}`);
    return response.data;
    */

    // MOCK IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 300));
    const showtime = MOCK_SHOWTIMES.find(s => s.showtime_id === Number(showtimeId));
    if (!showtime) throw new Error('Showtime not found');
    return showtime;
  },

  getScreen: async (screenId: number) => {
    // REAL IMPLEMENTATION:
    /*
    const response = await axios.get(`${THEATRE_API_URL}/screens/${screenId}`);
    return response.data;
    */

    // MOCK IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 300));
    const screen = MOCK_SCREENS[screenId];
    if (!screen) throw new Error('Screen not found');
    return screen;
  },

  getTheatre: async (theatreId: number) => {
    // REAL IMPLEMENTATION:
    /*
    const response = await axios.get(`${THEATRE_API_URL}/theatres/${theatreId}`);
    return response.data;
    */

    // MOCK IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 300));
    const theatre = MOCK_THEATRES[theatreId];
    if (!theatre) throw new Error('Theatre not found');
    return theatre;
  },

  getCinema: async (cinemaId: number) => {
    // REAL IMPLEMENTATION:
    /*
    const response = await axios.get(`${THEATRE_API_URL}/cinemas/${cinemaId}`);
    return response.data;
    */

    // MOCK IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 300));
    const cinema = MOCK_CINEMAS.find(c => c.cinema_id === cinemaId);
    if (!cinema) throw new Error('Cinema not found');
    return cinema;
  }
};

// Booking Service
export const bookingApi = {
  getBookedSeats: async (showtimeId: string) => {
    // REAL IMPLEMENTATION:
    /*
    const response = await axios.get(`${BOOKING_API_URL}/api/bookings/showtime/${showtimeId}/seats`);
    return response.data.seats;
    */

    // MOCK IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 300));
    // Return random subset of booked seats for variety if needed, 
    // or just static list for now.
    // Let's make it deterministic based on showtimeId to look real
    if (Number(showtimeId) % 2 === 0) {
        return MOCK_BOOKED_SEATS;
    }
    return [
        { row: 2, col: 2, status: 'booked', booking_id: 10 },
        { row: 2, col: 3, status: 'booked', booking_id: 10 },
        { row: 3, col: 4, status: 'booked', booking_id: 11 }
    ];
  },

  createBooking: async (bookingData: {
    user_id: number;
    showtime_id: number;
    seats: { row: number; col: number }[];
  }) => {
    // REAL IMPLEMENTATION:
    /*
    const response = await axios.post(`${BOOKING_API_URL}/api/bookings/`, bookingData);
    return response.data;
    */

    // MOCK IMPLEMENTATION:
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Mock Booking Created:', bookingData);
    return {
        booking_id: Math.floor(Math.random() * 10000),
        status: 'confirmed',
        message: 'Booking created successfully (MOCK)'
    };
  }
};
