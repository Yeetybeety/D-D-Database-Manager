import React, { useState } from 'react';

const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 p-2 bg-gray-800 text-white text-sm rounded shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;