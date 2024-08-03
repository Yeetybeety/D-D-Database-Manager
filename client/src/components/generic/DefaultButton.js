import React from 'react';
import './button.css';

const DefaultButton = ({ children, onClick, className = '', variant = 'primary' }) => {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    destructive: "btn-destructive",
    revival: "btn-revival",
    hollow: "btn-hollow"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className} flex items-center justify-center`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DefaultButton;