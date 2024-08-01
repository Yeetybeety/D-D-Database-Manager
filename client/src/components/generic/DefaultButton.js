// src/components/ui/Button.js
import React from 'react';

const DefaultButton = ({ children, onClick, className = '', variant = 'primary' }) => {
  const baseClasses = "px-6 py-2 rounded-md outline-none ring-offset-2 focus:ring-2";
  const variantClasses = {
    primary: "text-white bg-indigo-600 ring-indigo-600 hover:bg-indigo-700",
    secondary: "text-indigo-600 bg-white border border-indigo-600 ring-indigo-600 hover:bg-indigo-50",
    destructive: "text-white bg-red-600 ring-red-600 hover:bg-red-700",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DefaultButton;