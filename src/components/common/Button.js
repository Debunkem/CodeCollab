// src/components/common/Button.js
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ to, onClick, children, variant = 'primary', disabled = false }) => {
  // Base styles for the new "tech" look
  const baseStyle = "font-mono uppercase tracking-wider py-2 px-6 text-sm font-bold transition";
  
  const variants = {
    // New "neon green" primary style from the video
    primary: 'bg-green-400 text-black hover:bg-green-300',
    // A simple border-only style
    secondary: 'border border-gray-700 text-gray-400 hover:bg-gray-800',
  };

  const disabledStyle = "cursor-not-allowed opacity-50";

  const className = `
    ${baseStyle}
    ${variants[variant]}
    ${disabled ? disabledStyle : ''}
  `;

  if (to && !disabled) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;