import React from 'react';

const UserProfile: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">User Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
            JD
          </div>
          <div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-slate-500">john.doe@example.com</p>
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
