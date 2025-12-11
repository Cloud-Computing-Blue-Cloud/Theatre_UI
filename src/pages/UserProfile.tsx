import React, { useEffect, useState } from 'react';
import { userApi, type User } from '../services/api';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user ID from local storage or default to 1
        let storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
          storedUserId = '1';
          localStorage.setItem('userId', storedUserId);
        }
        const userId = parseInt(storedUserId, 10);
        const data = await userApi.getProfile(userId);
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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

  if (!user) {
    return <div className="p-6">User not found</div>;
  }

  const initials = `${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}`.toUpperCase();
  const fullName = `${user.first_name} ${user.last_name || ''}`.trim();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">User Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{fullName}</h2>
            <p className="text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <button className="text-indigo-600 hover:underline">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
