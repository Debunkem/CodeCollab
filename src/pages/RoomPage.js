import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom'; // Import our new hook
import FreeCodeRoom from '../components/room/FreeCodeRoom';

// We will create these two components next:
// import ChallengeRoom from '../components/room/ChallengeRoom';

//  IMPORT FIREBASE AND AUTH HELPERS
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../services/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const RoomPage = () => {
  
  const { roomId } = useParams(); // 1. Get the 'roomId' from the URL (e.g., /room/abc123)
  const { room, code, updateCode, output, updateOutput, loading, error } = useRoom(roomId); // 2. Fetch the room's data using our hook
  const { currentUser, userProfile } = useAuth(); // <-- 3. GET THE CURRENT USER

  // ENTIRE useEffect BLOCK
  useEffect(() => {
    // This effect handles adding the user to the participant list
    if (loading || !room || !currentUser || !userProfile) {
      // Don't do anything if data isn't ready
      return;
    }

    const isParticipant = room.participants.includes(currentUser.uid);

    if (!isParticipant) {
      // User is NOT in the list, so let's add them
      const joinRoom = async () => {
        const roomDocRef = doc(firestore, 'rooms', roomId);
        const newParticipantProfile = {
          uid: currentUser.uid,
          username: userProfile.username,
          avatar: userProfile.avatar,
        };

        try {
          // arrayUnion safely adds an item to an array only if it's not already present
          await updateDoc(roomDocRef, {
            participants: arrayUnion(currentUser.uid),
            participantProfiles: arrayUnion(newParticipantProfile),
          });
        } catch (err) {
          console.error("Error joining room:", err);
        }
      };
      
      joinRoom();
    }
  }, [room, loading, currentUser, userProfile, roomId]);
  

  // 3. Show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">Joining Room...</h1>
      </div>
    );
  }

  // 4. Handle errors (e.g., room not found)
  if (error || !room) {
    console.error(error);
    // If the room doesn't exist, just send them back to the dashboard
    return <Navigate to="/dashboard" />;
  }

  // 5. This is the key logic!
  // Read the 'mode' from the room data and show the correct component.
  if (room.mode === 'Free Code') {
    // PASS NEW PROPS
    return (
      <FreeCodeRoom
        room={room}
        code={code}
        updateCode={updateCode}
        output={output}
        updateOutput={updateOutput}
      />
    );
  }

  if (room.mode === 'Challenge') {
    // ... (still a placeholder)
  }

  // Fallback if room mode is unknown
  return <Navigate to="/dashboard" />;
};

export default RoomPage;