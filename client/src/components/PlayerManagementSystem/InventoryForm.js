import React, { useState } from 'react';

const InventoryForm = ({ inventory, onSubmit, onCancel }) => {
  const [name, setName] = useState(inventory ? inventory.name : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded-md">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Save
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
