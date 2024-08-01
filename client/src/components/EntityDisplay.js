import React, { useState } from 'react';
import EntityEdit from './EditEntity';
const EntityDisplay = ({ entityData, fields, onDelete, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (updatedEntity) => {
    onEdit(updatedEntity); // Notify parent component about the update
    handleCloseModal(); // Close the modal after editing
  };

  return (
    <div className="p-3 bg-gray-100 rounded-lg shadow-md">
      <div>
        {Object.entries(fields).map(([label, options]) => (
          <div key={label} className="mb-2 flex">
            <h3 className="text-l font-bold mb-1">{label}: </h3>
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

      <div className="flex justify-end mt-4">
        <button
          onClick={() => onDelete(entityData.Title)}
          className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 mr-2"
        >
          Delete
        </button>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Edit
        </button>
      </div>

      {/* Render EntityCreation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <EntityEdit
              name="Entity" // Adjust this if you need to display a specific name
              fields={fields}
              onEditEntity={handleEdit} // Use handleEdit to update the entity
              onClose={handleCloseModal}
              entityData={entityData} // Pass the entityData to pre-fill the form
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityDisplay;
