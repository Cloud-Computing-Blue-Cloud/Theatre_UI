// API service for communicating with backend microservices

// Base URL for the movie service
// Replace YOUR_VM_IP with your actual VM's external IP address
const MOVIE_SERVICE_URL = 'http://localhost:5001';

export interface MovieApiResponse {
  movie_id: number;
  name: string;
  genres: string[];
  runtime_minutes: number | null;
  release_date: string | null;
  rating: number | null;
  language: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MoviesPageResponse {
  items: MovieApiResponse[];
  meta?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_prev: boolean;
    has_next: boolean;
  };
}

/**
 * Fetch all movies from the movie service
 * @param isActive - Filter by active status (default: true)
 * @returns Promise with movies page response
 */
export async function fetchMovies(isActive: boolean = true): Promise<MoviesPageResponse> {
  const url = new URL(`${MOVIE_SERVICE_URL}/movies`);
  url.searchParams.append('is_active', String(isActive));
  
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }

    const data: MoviesPageResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

/**
 * Format runtime minutes to a human-readable duration string
 * @param minutes - Runtime in minutes
 * @returns Formatted duration string (e.g., "2h 28m")
 */
export function formatDuration(minutes: number | null): string {
  if (!minutes) {
    return 'N/A';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}

