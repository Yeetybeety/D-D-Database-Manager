import React from 'react';

const EntityDisplay = ({ entityData, fields }) => {

    console.log(entityData)

  return (

    <div className="p-3 bg-gray-100 rounded-lg shadow-md">
      {Object.entries(fields).map(([label, options]) => (
        <div key={label} className="mb-2 flex">
          <h3 className="text-l font-bold mb-1">{label}:  </h3>
          {Array.isArray(entityData[label]) ? (
            <div>
              {entityData[label].length > 0 ? (
                <ul>
                  {entityData[label].map((item, index) => (
                    <li key={item.id || index}>
                      {item.name} - {item.class}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No {label.toLowerCase()} available</p>
              )}
            </div>
          ) : (
            <p>{entityData[label] || `No ${label.toLowerCase()}`}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EntityDisplay;
