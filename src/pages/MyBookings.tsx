import React, { useEffect, useState } from 'react';
import { bookingApi, theatreApi, movieApi, type Booking, type Showtime, type Movie, type Theatre, type Screen } from '../services/api';
import { Loader2, Calendar, MapPin, Ticket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BookingWithDetails extends Booking {
  movie?: Movie;
  showtime?: Showtime;
  theatre?: Theatre;
  screen?: Screen;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const userBookings = await bookingApi.getUserBookings(user.user_id);
        
        // Sort by creation date desc
        userBookings.sort((a: Booking, b: Booking) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Fetch details for each booking
        const detailedBookings = await Promise.all(
          userBookings.map(async (booking: Booking) => {
            try {
              // 1. Get Showtime
              const showtime = await theatreApi.getShowtimeById(booking.showtime_id.toString());
              
              // 2. Get Movie
              const movie = await movieApi.getById(showtime.movie_id.toString());
              
              // 3. Get Screen
              const screen = await theatreApi.getScreen(showtime.screen_id);
              
              // 4. Get Theatre
              const theatre = await theatreApi.getTheatre(screen.theatre_id);

              return {
                ...booking,
                showtime,
                movie,
                screen,
                theatre
              };
            } catch (err) {
              console.error(`Failed to load details for booking ${booking.booking_id}`, err);
              return booking;
            }
          })
        );

        setBookings(detailedBookings);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load your bookings.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-slate-500">
          <Ticket className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-lg">You haven't booked any movies yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Movie Poster */}
                  <div className="w-full md:w-32 h-48 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {booking.movie?.posterUrl ? (
                      <img 
                        src={booking.movie.posterUrl} 
                        alt={booking.movie.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Poster
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                          {booking.movie?.name || 'Unknown Movie'}
                        </h2>
                        <div className="flex items-center text-slate-600 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.theatre?.name || 'Unknown Theatre'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {booking.showtime 
                                ? new Date(booking.showtime.start_time).toLocaleString() 
                                : 'Unknown Time'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`
                        px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'}
                      `}>
                        {booking.status}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">Seats</h3>
                      <div className="flex flex-wrap gap-2">
                        {booking.seats.map((seat, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            Row {seat.row}, Seat {seat.col}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-slate-400">
                      Booking ID: #{booking.booking_id} • Booked on {new Date(booking.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
