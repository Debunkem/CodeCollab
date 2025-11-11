import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid'; // For generating unique room IDs

const TabCreateRoom = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [roomName, setRoomName] = useState("");
  const [mode, setMode] = useState("Free Code"); // "Free Code" or "Challenge"
  const [language, setLanguage] = useState(userProfile.preferredLanguage || 'Python');
  const [privacy, setPrivacy] = useState("Public"); // "Public" or "Private"
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName) {
      setError("Please enter a room name.");
      return;
    }
    setLoading(true);
    setError("");

    const newRoomId = nanoid(10); // Generate a 10-char unique ID

    try {
      // Create a new document in the 'rooms' collection
      const roomDocRef = doc(firestore, 'rooms', newRoomId);
      
      await setDoc(roomDocRef, {
        roomId: newRoomId,
        hostId: currentUser.uid,
        hostUsername: userProfile.username,
        roomName: roomName,
        mode: mode,
        language: language,
        privacy: privacy,
        maxParticipants: maxParticipants,
        participants: [currentUser.uid], // Start with the host
        participantProfiles: [
          { uid: currentUser.uid, username: userProfile.username, avatar: userProfile.avatar }
        ],
        createdAt: serverTimestamp(),
      });

      // Success! Navigate to the new room
      navigate(`/room/${newRoomId}`);

    } catch (err) {
      console.error("Error creating room:", err);
      setError("Failed to create room. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Create New Room</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room Name */}
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-gray-300">Room Name</label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Graph Algorithms Practice"
          />
        </div>

        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Select Mode</label>
          <div className="flex gap-4 mt-2">
            <button type="button" onClick={() => setMode('Free Code')}
              className={`flex-1 p-4 rounded-lg transition-all ${
                mode === 'Free Code' ? 'bg-indigo-600 ring-2 ring-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}>
              <h3 className="font-bold text-lg">Free Code Mode</h3>
              <p className="text-sm text-gray-300">Collaborative editor, practice together.</p>
            </button>
            <button type="button" onClick={() => setMode('Challenge')}
              className={`flex-1 p-4 rounded-lg transition-all ${
                mode === 'Challenge' ? 'bg-purple-600 ring-2 ring-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}>
              <h3 className="font-bold text-lg">Challenge Mode</h3>
              <p className="text-sm text-gray-300">Competitive coding battle!</p>
            </button>
          </div>
        </div>

        {/* Language, Privacy, Participants (in a grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-300">Language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>C++</option>
              <option>Java</option>
              <option>Python</option>
              <option>JavaScript</option>
            </select>
          </div>
          {/* Privacy */}
          <div>
            <label htmlFor="privacy" className="block text-sm font-medium text-gray-300">Privacy</label>
            <select id="privacy" value={privacy} onChange={(e) => setPrivacy(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>
          {/* Max Participants */}
          <div>
            <label htmlFor="participants" className="block text-sm font-medium text-gray-300">Participants</label>
            <select id="participants" value={maxParticipants} onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
        </div>
        
        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-green-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:bg-gray-500"
        >
          {loading ? 'Creating Room...' : 'Create Room & Enter'}
        </button>
      </form>
    </div>
  );
};

export default TabCreateRoom;