import { useState, useEffect } from 'react';
import { firestore, db } from '../services/firebase';
import { doc, onSnapshot as onFirestoreSnapshot } from 'firebase/firestore';
import { ref, onValue, set } from 'firebase/database';

const defaultOutput = 'Click "Run Code" to see output...';

export const useRoom = (roomId) => {
  const [room, setRoom] = useState(null); // From Firestore
  const [code, setCode] = useState(""); // From RTDB
  const [output, setOutput] = useState(defaultOutput); // From RTDB
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect for Firestore (room details)
  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      setError("No room ID provided");
      return;
    }
    setLoading(true);
    const roomDocRef = doc(firestore, 'rooms', roomId);

    // Set up a real-time listener (onSnapshot)
    const unsubscribe = onFirestoreSnapshot(
      roomDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setRoom(docSnap.data()); // Room data found, set it
          setError(null);
        } else {
          setError("Room not found"); // No room with this ID
          setRoom(null);
        }
        setLoading(false);
      },
      (err) => {
        // Handle permissions errors or other failures
        console.error("Error listening to room:", err);
        setError("Failed to load room data");
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [roomId]); // Re-run this effect if the roomId ever changes

  // Effect for Realtime Database (code)
  useEffect(() => {
    if (!roomId) return;

    // A reference to the 'code' node in RTDB for this room
    const codeRef = ref(db, `rooms/${roomId}/code`);

    // Set up a listener for the code
    const unsubscribe = onValue(codeRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setCode(data);
      } else {
        // If no code exists, initialize it
        set(codeRef, `// Welcome to ${roomId}!\n// Start coding in ${room?.language || 'your language'}...`);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [roomId, room?.language]); // Depends on room?.language to initialize

  // NEW Effect for Realtime Database (output)
  useEffect(() => {
    if (!roomId) return;
    const outputRef = ref(db, `rooms/${roomId}/output`);

    const unsubscribe = onValue(outputRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setOutput(data);
      } else {
        set(outputRef, defaultOutput); // Initialize if doesn't exist
      }
    });
    return () => unsubscribe();
  }, [roomId]);


  // Function to update code
  const updateCode = (newCode) => {
    if (!roomId) return;
    const codeRef = ref(db, `rooms/${roomId}/code`);
    set(codeRef, newCode);
  };

  // NEW Function to update output
  const updateOutput = (newOutput) => {
    if (!roomId) return;
    const outputRef = ref(db, `rooms/${roomId}/output`);
    set(outputRef, newOutput);
  };

  return {
    room,
    code,
    updateCode,
    output,
    updateOutput,
    loading,
    error
  };
};