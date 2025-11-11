// src/pages/LandingPage.js
import React from 'react';
import Button from '../components/common/Button'; // Import our updated Button

// A small component for the top navigation links
const NavLink = ({ children }) => (
  <a href="#" className="text-gray-400 hover:text-white transition px-3 py-2 text-sm uppercase tracking-wider">
    {children}
  </a>
);

const LandingPage = () => {
  return (
    // Apply the dot-grid background to the main container
    <div className="flex flex-col min-h-screen bg-dot-grid">
      
      {/* Header Section */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Navigation Links from the video */}
        <div className="hidden md:flex items-center">
          <NavLink>Technologies</NavLink>
          <NavLink>Solutions</NavLink>
          <NavLink>Features</NavLink>
          <NavLink>Use Cases</NavLink>
          <NavLink>Ecosystem</NavLink>
        </div>
        
        {/* "LAUNCH" Button from the video, linking to our auth page */}
        <div>
          <Button to="/auth" variant="primary">
            Launch App
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 -mt-16">
        
        {/* Main Headline from the video */}
        <h2 className="text-5xl md:text-7xl font-bold mb-12 leading-tight">
          WELCOME TO THE
          <br />
          VERIFIABLE
          <br />
          INTERNET
        </h2>

        {/* ZKP Checker button from the video */}
        <div>
          <Button to="/dashboard" variant="primary">
            $ZKP CHECKER
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;