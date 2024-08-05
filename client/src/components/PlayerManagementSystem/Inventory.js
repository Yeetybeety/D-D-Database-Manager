import React from 'react';
import InventoryCard from './InventoryCard';

// const PlayerInventory = ({ inventory, onAddItem, onEditItem, onDeleteItem }) => {

//     return (
//         <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Inventory</h2>
//             <div className='flex flex-col mt-8 mb-8'>
//                 <div className="grid grid-cols-5 gap-4 w-4/5 max-w-full max-h-full">
//                     {inventory.map((item, index) => (
//                         <InventoryCard
//                             key={index}
//                             item={item}
//                             onEditItem={() => onEditItem(item)}
//                             onDeleteItem={() => onDeleteItem(item.ItemID)}
//                         />
//                     ))}
//                 </div>
//             </div>
//             <button onClick={onAddItem} className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Add Item
//             </button>
//         </div>
//     );
// };

const PlayerInventory = ({ inventory, onAddItem, onEditItem, onDeleteItem }) => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Inventory</h2>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Array(20).fill(null).map((_, index) => (
            <InventoryCard
              key={index}
              item={inventory[index]}
              onAddItem={() => onAddItem(index)}
              onEditItem={() => onEditItem(inventory[index])}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      </div>
    );
  };

export default PlayerInventory;