import React from 'react';
import InventoryCard from './InventoryCard';

const PlayerInventory = ({ inventory, onAddItem, onEditItem, onDeleteItem, moveItem }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Inventory</h2>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array(20).fill(null).map((_, index) => (
          <InventoryCard
            key={inventory[index] ? inventory[index].ItemID : `empty-${index}`}
            item={inventory[index]}
            index={index}
            onAddItem={() => onAddItem(index)}
            onEditItem={() => onEditItem(inventory[index])}
            onDeleteItem={onDeleteItem}
            moveItem={moveItem}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerInventory;