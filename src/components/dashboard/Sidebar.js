import React from 'react';
import { auth } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Placeholder icon for stats - in a real app, we'd use an icon library
const StatIcon = () => <span className="mr-2">📊</span>;

const Sidebar = () => {
  const { currentUser, userProfile } = useAuth();

  // Handle case where profile might still be loading (though unlikely here)
  if (!currentUser || !userProfile) {
    return (
      <div className="w-64 bg-gray-800 p-4 text-gray-400">Loading...</div>
    );
  }

  // Determine skill level color
  const skillColor = {
    Beginner: 'bg-green-500',
    Intermediate: 'bg-yellow-500',
    Advanced: 'bg-red-500',
  }[userProfile.skillLevel] || 'bg-gray-500';

  return (
    <div className="w-72 bg-gray-800 text-white min-h-screen p-5 flex flex-col">
      {/* 1. Profile Section [cite: 43] */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={userProfile.avatar || 'default-avatar-url.png'} // Use Google avatar
          alt="Avatar"
          className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-500"
        />
        <h2 className="text-2xl font-bold">{userProfile.username}</h2>
        <div className="flex items-center mt-2">
          <span className={`w-3 h-3 rounded-full ${skillColor} mr-2`}></span>
          <span className="text-sm text-gray-300">{userProfile.skillLevel}</span>
        </div>
        {/* Placeholder for Reputation [cite: 46] */}
        <span className="text-sm text-yellow-400 mt-1">⭐ 4.8/5 Reputation</span>
      </div>

      {/* 2. Quick Stats Section */}
      <div className="mb-6">
        <h3 className="text-xs uppercase text-gray-400 font-semibold mb-3">Stats</h3>
        <div className="space-y-3">
          <p className="flex items-center text-gray-300"><StatIcon /> Problems solved: <strong className="ml-2">0</strong></p>
          <p className="flex items-center text-gray-300"><StatIcon /> Partners met: <strong className="ml-2">0</strong></p>
          <p className="flex items-center text-gray-300"><StatIcon /> Total time: <strong className="ml-2">0h</strong></p>
          <p className="flex items-center text-gray-300"><StatIcon /> Current streak: <strong className="ml-2">0 days</strong></p>
        </div>
      </div>

      {/* 3. Friends List Section (Placeholder) [cite: 53] */}
      <div>
        <h3 className="text-xs uppercase text-gray-400 font-semibold mb-3">Friends</h3>
        <div className="space-y-3">
          {/* Online Friend Example [cite: 54] */}
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Priya
            </span>
            <Link to="#" className="text-indigo-400 hover:text-indigo-300 text-sm">Chat</Link>
          </div>
          {/* Offline Friend Example [cite: 57] */}
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-500">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              Rahul
            </span>
          </div>
        </div>
      </div>
      
      {/* Spacer to push logout to bottom */}
      <div className="flex-grow"></div> 
      
      {/* Logout Button (Bonus) */}
      <button 
        onClick={() => auth.signOut()} // We need to import 'auth'
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;