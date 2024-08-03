import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export default Card;