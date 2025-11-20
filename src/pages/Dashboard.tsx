import React from 'react';
import MovieCard, { type Movie } from '../components/MovieCard';

const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Inception',
    genre: 'Sci-Fi',
    rating: 8.8,
    duration: '2h 28m',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
  },
  {
    id: '2',
    title: 'The Dark Knight',
    genre: 'Action',
    rating: 9.0,
    duration: '2h 32m',
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=800&auto=format&fit=crop',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  },
  {
    id: '3',
    title: 'Interstellar',
    genre: 'Sci-Fi',
    rating: 8.6,
    duration: '2h 49m',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
  },
  {
    id: '4',
    title: 'Dune: Part Two',
    genre: 'Sci-Fi',
    rating: 8.9,
    duration: '2h 46m',
    posterUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
  },
  {
    id: '5',
    title: 'Oppenheimer',
    genre: 'Biography',
    rating: 8.4,
    duration: '3h 00m',
    posterUrl: 'https://images.unsplash.com/photo-1550100136-e074fa714874?q=80&w=800&auto=format&fit=crop',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
  },
  {
    id: '6',
    title: 'Spider-Man: Across the Spider-Verse',
    genre: 'Animation',
    rating: 8.7,
    duration: '2h 20m',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
  },
];

const Dashboard: React.FC = () => {
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_MOVIES.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
