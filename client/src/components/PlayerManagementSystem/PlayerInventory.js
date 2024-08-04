import React from 'react';

const PlayerInventory = ({ inventory = [], onAddItemClick, onDeleteItemClick }) => {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {inventory.map((item, index) => (
          <div
            key={index}
            className="bg-gray-200 border border-gray-300 rounded flex items-center justify-center relative p-2 min-w-[4rem]"
            style={{ minHeight: '2.5rem' }}
          >
            {item ? (
              <>
                <span className="text-center">{item.name}</span>
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => onDeleteItemClick(index)}
                >
                  x
                </button>
              </>
            ) : (
              <button
                className="bg-blue-500 text-white rounded-full p-1"
                onClick={() => onAddItemClick(index)}
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerInventory;