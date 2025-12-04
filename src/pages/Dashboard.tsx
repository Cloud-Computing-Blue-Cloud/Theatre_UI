import React, { useState, useEffect } from 'react';
import MovieCard, { type Movie } from '../components/MovieCard';
import { fetchMovies, formatDuration, type MovieApiResponse } from '../services/api';

const Dashboard: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchMovies(true); // Fetch only active movies
        
        // Map API response to Movie interface
        const mappedMovies: Movie[] = response.items.map((movie: MovieApiResponse) => ({
          id: String(movie.movie_id),
          title: movie.name,
          genre: movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'Unknown',
          rating: movie.rating ? Number(movie.rating) : 0,
          duration: formatDuration(movie.runtime_minutes),
          posterUrl: 'https://via.placeholder.com/400x600?text=Movie+Poster', // Placeholder image
          description: `A ${movie.language || 'film'} movie${movie.genres && movie.genres.length > 0 ? ` in the ${movie.genres.join(', ')} genre` : ''}.${movie.release_date ? ` Released on ${new Date(movie.release_date).toLocaleDateString()}.` : ''}`, // Placeholder description
        }));
        
        setMovies(mappedMovies);
      } catch (err) {
        console.error('Failed to load movies:', err);
        setError(err instanceof Error ? err.message : 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Now Showing</h1>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
            <option>All Genres</option>
            <option>Action</option>
            <option>Sci-Fi</option>
            <option>Drama</option>
          </select>
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading movies...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error loading movies</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No movies available at the moment.</p>
        </div>
      )}
      
      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
