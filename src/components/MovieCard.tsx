import React from 'react';
import { Star, Clock } from 'lucide-react';
import Button from './ui/Button';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  duration: string;
  posterUrl: string;
  description: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-slate-100">
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-200">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {movie.rating}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1" title={movie.title}>
          {movie.title}
        </h3>
        <div className="flex items-center text-slate-500 text-sm mb-3 gap-3">
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">
            {movie.genre}
          </span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{movie.duration}</span>
          </div>
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
          {movie.description}
        </p>
        <Button className="w-full mt-auto">Book Now</Button>
      </div>
    </div>
  );
};

export default MovieCard;
