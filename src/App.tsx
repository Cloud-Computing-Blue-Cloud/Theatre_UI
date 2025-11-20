import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
