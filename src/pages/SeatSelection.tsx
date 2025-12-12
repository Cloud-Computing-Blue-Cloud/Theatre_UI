import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theatreApi, bookingApi, type Showtime, type Screen, type BookedSeat, type Theatre } from '../services/api';
import { Loader2, ArrowLeft, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';

const SeatSelection: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [screen, setScreen] = useState<Screen | null>(null);
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [bookedSeats, setBookedSeats] = useState<BookedSeat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<{ row: number; col: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!showtimeId) return;
      try {
        setLoading(true);
        // 1. Get showtime details
        const showtimeResp = await theatreApi.getShowtimeById(showtimeId);
        setShowtime(showtimeResp);

        // 2. Get screen details
        const screenData = await theatreApi.getScreen(showtimeResp.screen_id);
        setScreen(screenData);

        // 3. Get theatre details
        const theatreData = await theatreApi.getTheatre(screenData.theatre_id);
        setTheatre(theatreData);

        // 4. Get booked seats
        const seatsData = await bookingApi.getBookedSeats(showtimeId);
        setBookedSeats(seatsData);

      } catch (err) {
        setError('Failed to load booking details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showtimeId]);

  const toggleSeat = (row: number, col: number) => {
    const isSelected = selectedSeats.some(s => s.row === row && s.col === col);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => !(s.row === row && s.col === col)));
    } else {
      if (selectedSeats.length >= 10) {
        alert("You can only select up to 10 seats.");
        return;
      }
      setSelectedSeats([...selectedSeats, { row, col }]);
    }
  };

  const handleBooking = async () => {
    if (!showtime || selectedSeats.length === 0) return;
    
    try {
      setBookingInProgress(true);
      // Get user ID from local storage or default to 1
      let storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        storedUserId = '1';
        localStorage.setItem('userId', storedUserId);
      }
      const userId = parseInt(storedUserId, 10);
      
      const response = await bookingApi.createBooking({
        user_id: userId,
        showtime_id: showtime.showtime_id,
        seats: selectedSeats
      });

      // Start polling
      const bookingId = response.booking_id;
      const pollInterval = setInterval(async () => {
        try {
          const booking = await bookingApi.getBooking(bookingId);
          if (booking.status.toLowerCase() === 'confirmed') {
            clearInterval(pollInterval);
            setBookingInProgress(false);
            alert('Booking successful! Redirecting to your bookings...');
            navigate('/bookings');
          }
        } catch (err) {
          console.error("Error polling booking status:", err);
          // Optional: handle polling error (maybe stop after N retries)
        }
      }, 5000);

    } catch (err) {
      console.error(err);
      alert('Failed to create booking. Please try again.');
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !showtime || !screen) {
    return (
      <div className="text-center text-red-600 p-8">
        {error || 'Something went wrong'}
      </div>
    );
  }

  const isSeatBooked = (row: number, col: number) => {
    return bookedSeats.some(s => s.row === row && s.col === col);
  };

  const isSeatSelected = (row: number, col: number) => {
    return selectedSeats.some(s => s.row === row && s.col === col);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Select Seats</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-slate-600 mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{theatre?.name}</span>
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div>
            Screen {screen.screen_number} • {new Date(showtime.start_time).toLocaleString()}
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="w-3/4 h-4 bg-slate-300 rounded-lg transform perspective-500 rotate-x-12 shadow-xl mb-8 flex items-center justify-center text-xs text-slate-500 font-bold tracking-widest uppercase">
            Screen
          </div>
        </div>

        <div className="flex justify-center overflow-x-auto pb-8">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${screen.num_cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: screen.num_rows }).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {Array.from({ length: screen.num_cols }).map((_, colIndex) => {
                  const row = rowIndex + 1;
                  const col = colIndex + 1;
                  const booked = isSeatBooked(row, col);
                  const selected = isSeatSelected(row, col);

                  return (
                    <button
                      key={`${row}-${col}`}
                      disabled={booked}
                      onClick={() => toggleSeat(row, col)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg text-xs font-medium transition-all
                        ${booked 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                          : selected
                            ? 'bg-indigo-600 text-white shadow-lg scale-110'
                            : 'bg-white border-2 border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                        }
                      `}
                      title={`Row ${row}, Seat ${col}`}
                    >
                      {col}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-6 text-sm text-slate-600 mb-8 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg border-2 border-slate-300"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg bg-indigo-600"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-t-lg bg-slate-200"></div>
            <span>Booked</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500 mb-1">Total Price</div>
            <div className="text-2xl font-bold text-slate-900">
              ${(selectedSeats.length * showtime.price).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
            </div>
          </div>
          <Button 
            size="lg" 
            disabled={selectedSeats.length === 0 || bookingInProgress}
            onClick={handleBooking}
          >
            {bookingInProgress ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
