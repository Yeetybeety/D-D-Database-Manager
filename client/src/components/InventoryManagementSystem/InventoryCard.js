import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../generic/DefaultButton';

/*
  This component is used to display an inventory item card.
  inventory: inventory db object
  onEdit: function to handle edit button click
  onDelete: function to handle delete button click
  setInventory: function to update inventory state
*/
const InventoryCard = ({ inventory, onEdit, onDelete, setInventory }) => {
  return (
    <div className="relative max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="inventory-info">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{inventory.name}</h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Type: {inventory.type}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Quantity: {inventory.quantity}
        </p>
      </div>

      <div className="flex justify-between">
        <Button onClick={onEdit} variant="primary">Edit</Button>
        <Button onClick={onDelete} variant="destructive">Delete</Button>
      </div>
    </div>
  );
};

export default InventoryCard;
