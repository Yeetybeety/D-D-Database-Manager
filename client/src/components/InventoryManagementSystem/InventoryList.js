import React from 'react';
import InventoryCard from './InventoryCard';

const InventoryList = ({ inventories, onEdit, onDelete, setInventory }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {inventories.map((inventory) => (
        <InventoryCard 
          key={inventory.id} 
          inventory={inventory} 
          onEdit={() => onEdit(inventory)} 
          onDelete={() => onDelete(inventory.id)}
          setInventory={setInventory}
        />
      ))}
    </div>
  );
};

export default InventoryList;
