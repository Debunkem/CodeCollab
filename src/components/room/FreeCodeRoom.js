import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Editor from '@monaco-editor/react';
import OutputPanel from './OutputPanel';

// We'll create these components next
// import RoomHeader from './RoomHeader';
// import ParticipantPanel from './ParticipantPanel';
// import ChatPanel from './ChatPanel';

const FreeCodeRoom = ({ room, code, updateCode, output, updateOutput }) => {
  const { userProfile } = useAuth();
  
  const handleEditorChange = (value) => {
    updateCode(value); // Send new code to RTDB
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* 1. Header (Placeholder) */}
      <div className="flex-shrink-0 bg-gray-800 p-4 shadow-md z-10">
        <h1 className="text-2xl font-bold">{room.roomName}</h1>
        <span className="text-indigo-400">{room.language}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Main Coding Area */}
        <div className="flex-1 flex flex-col">
          {/* The Monaco Code Editor */}
          <div className="flex-1 bg-gray-800">
            <Editor
              height="100%"
              theme="vs-dark"
              language={room.language.toLowerCase()}
              value={code} // Binds editor value to our 'code' state
              onChange={handleEditorChange} // Calls updateCode on change
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
              }}
            />
          </div>

          {/* 3. Output/Terminal (Placeholder) */}
          <OutputPanel
            code={code}
            language={room.language}
            output={output}
            updateOutput={updateOutput}
          />
          
        </div>

        {/* 4. Right Sidebar (Participants & Chat) */}
        <div className="w-80 flex-shrink-0 bg-gray-800 border-l border-gray-700 p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Participants</h2>
          <div className="mb-4">
            {room.participantProfiles.map(p => (
              <div key={p.uid} className="flex items-center gap-3 mb-2">
                <img src={p.avatar} alt={p.username} className="w-8 h-8 rounded-full"/>
                <span>{p.username} {p.uid === room.hostId && '(Host)'}</span>
              </div>
            ))}
          </div>
          <hr className="border-gray-700 my-4" />
          <h2 className="text-xl font-bold mb-4">Chat</h2>
          <div className="flex-1 text-gray-400">
            {/* Chat placeholder */}
            <p>Chat coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeCodeRoom;