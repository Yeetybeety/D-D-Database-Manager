import React from 'react';

const Card = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;
