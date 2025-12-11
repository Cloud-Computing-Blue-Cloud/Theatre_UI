import React from 'react';
import { Star, Clock } from 'lucide-react';
import Button from './ui/Button';
import { type Movie } from '../services/api';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // Fallback image if posterUrl is missing
  const posterUrl = movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop';
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-slate-100">
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-200">
        <img
          src={posterUrl}
          alt={movie.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {movie.rating && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {movie.rating}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1" title={movie.name}>
          {movie.name}
        </h3>
        <div className="flex items-center text-slate-500 text-sm mb-3 gap-3">
          {movie.genres && movie.genres.length > 0 && (
            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">
              {movie.genres[0]}
            </span>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{movie.runtime_minutes}m</span>
          </div>
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
          {movie.description || 'No description available.'}
        </p>
        <Link to={`/movie/${movie.movie_id}`} className="mt-auto">
          <Button className="w-full">Book Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
