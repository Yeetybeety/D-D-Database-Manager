import React, { useState } from 'react';
import EntityMainContent from './EntityMainContent';

const Inventory = () => {
  const [inventories, setInventories] = useState([]);

  const handleCreateInventory = (newInventory) => {
    setInventories([...inventories, { ...newInventory }]);
  };

  const handleEditInventory = (updatedInventory) => {
    setInventories(inventories.map(inventory => 
      inventory.id === updatedInventory.id ? { ...updatedInventory } : inventory
    ));
  };

  const handleDeleteInventory = (id) => {
    setInventories(inventories.filter((inventory) => inventory.id !== id));
  };

  const fields = {
    'Name': null,
    'Type': null,
    'Quantity': null,
  };

  return (
    <div>
      <EntityMainContent 
        entity="Inventory" 
        fields={fields} 
        entities={inventories} 
        onCreateEntity={handleCreateInventory} 
        onDeleteEntity={handleDeleteInventory}
        onEditEntity={handleEditInventory}
      />
    </div>
  );
};

export default Inventory;
