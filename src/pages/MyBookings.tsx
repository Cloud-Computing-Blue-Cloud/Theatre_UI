import React from 'react';

const MyBookings: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">My Bookings</h1>
      <div className="bg-white rounded-lg shadow p-6 text-center text-slate-500">
        You haven't booked any movies yet.
      </div>
    </div>
  );
};

export default MyBookings;
