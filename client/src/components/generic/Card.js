import React from 'react';
import './styles.css';

const Card = ({ children, additionalClasses = '' }) => {
  return (
    <div className={`card block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-200 ${additionalClasses}`}>
      {children}
    </div>
  );
};

export default Card;