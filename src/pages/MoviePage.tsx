import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieApi, theatreApi, type Movie, type Showtime, type Cinema, type Theatre, type Screen } from '../services/api';
import { Loader2, Calendar, Clock, MapPin, ArrowLeft, Building2 } from 'lucide-react';

interface EnrichedShowtime extends Showtime {
  screen?: Screen;
  theatre?: Theatre;
  cinema?: Cinema;
}

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [enrichedShowtimes, setEnrichedShowtimes] = useState<EnrichedShowtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [movieData, showtimesData] = await Promise.all([
          movieApi.getById(id),
          theatreApi.getShowtimes(id)
        ]);
        setMovie(movieData);

        // Enrich showtimes with Screen, Theatre, and Cinema data
        const enriched = await Promise.all(showtimesData.map(async (showtime) => {
          const screen = await theatreApi.getScreen(showtime.screen_id);
          const theatre = await theatreApi.getTheatre(screen.theatre_id);
          const cinema = await theatreApi.getCinema(theatre.cinema_id);
          return { ...showtime, screen, theatre, cinema };
        }));
        
        setEnrichedShowtimes(enriched);
      } catch (err) {
        setError('Failed to load movie details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center text-red-600 p-8">
        {error || 'Movie not found'}
        <br />
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Group showtimes by Date -> Cinema -> Theatre
  const groupedShowtimes = enrichedShowtimes.reduce((acc, showtime) => {
    const date = new Date(showtime.start_time).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    
    if (!acc[date]) acc[date] = {};
    
    const cinemaName = showtime.cinema?.name || 'Unknown Cinema';
    if (!acc[date][cinemaName]) acc[date][cinemaName] = {};
    
    const theatreName = showtime.theatre?.name || 'Unknown Theatre';
    // Store theatre object to access address later if needed, but for grouping key is name
    // Actually, let's group by Theatre ID to be safe, but display Name.
    // For simplicity in rendering, let's structure it as:
    // Date -> Cinema Name -> Theatre Name -> List of Showtimes
    
    if (!acc[date][cinemaName][theatreName]) acc[date][cinemaName][theatreName] = [];
    acc[date][cinemaName][theatreName].push(showtime);
    
    return acc;
  }, {} as Record<string, Record<string, Record<string, EnrichedShowtime[]>>>);

  // Sort dates
  const sortedDates = Object.keys(groupedShowtimes).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Movies
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 h-96 md:h-auto relative bg-slate-200">
            <img 
              src={movie.posterUrl || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop'} 
              alt={movie.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-2/3 lg:w-3/4 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{movie.name}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                {movie.genres?.map(g => (
                  <span key={g} className="bg-slate-100 px-3 py-1 rounded-full font-medium">
                    {g}
                  </span>
                ))}
                <span className="flex items-center gap-1 px-3 py-1">
                  <Clock className="w-4 h-4" />
                  {movie.runtime_minutes} min
                </span>
                <span className="flex items-center gap-1 px-3 py-1 text-yellow-600 font-bold">
                  ★ {movie.rating}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Synopsis</h3>
              <p className="text-slate-600 leading-relaxed">
                {movie.description || 'No description available for this movie.'}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Showtimes
              </h3>
              
              {enrichedShowtimes.length === 0 ? (
                <p className="text-slate-500 italic">No showtimes available currently.</p>
              ) : (
                <div className="space-y-8">
                  {sortedDates.map(date => (
                    <div key={date} className="space-y-6">
                      <h4 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2">{date}</h4>
                      
                      {Object.keys(groupedShowtimes[date]).map(cinemaName => (
                        <div key={cinemaName} className="space-y-4">
                          <h5 className="font-semibold text-indigo-700 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {cinemaName}
                          </h5>
                          
                          {Object.keys(groupedShowtimes[date][cinemaName]).map(theatreName => {
                            const theatreShowtimes = groupedShowtimes[date][cinemaName][theatreName];
                            const theatreAddress = theatreShowtimes[0].theatre?.address;
                            
                            return (
                              <div key={theatreName} className="ml-4 pl-4 border-l-2 border-slate-100">
                                <div className="mb-3">
                                  <div className="font-medium text-slate-900">{theatreName}</div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {theatreAddress}
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-3">
                                  {theatreShowtimes.map(showtime => (
                                    <Link 
                                      key={showtime.showtime_id} 
                                      to={`/booking/${showtime.showtime_id}`}
                                      className="group block"
                                    >
                                      <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer text-center min-w-[100px]">
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                                          {new Date(showtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                          Screen {showtime.screen?.screen_number}
                                        </div>
                                        <div className="text-xs font-medium text-slate-600 mt-1">
                                          ${showtime.price}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
