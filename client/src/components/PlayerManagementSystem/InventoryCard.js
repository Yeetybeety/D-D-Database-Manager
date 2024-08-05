import React from 'react';
import { PlusCircleIcon, XCircleIcon, SwordIcon, ShieldIcon, CubeIcon, BeakerIcon } from '../generic/Icons';
import '../generic/styles.css';

// const InventoryCard = ({ item, onAddItem, onDeleteItem }) => {
//   return (
//     <div className="inventory-card bg-gray-100 border border-gray-300 rounded p-2 flex items-center justify-center relative">
//       {item ? (
//         <>
//           <div className="text-center">
//             <div className="font-semibold">{item.Name}</div>
//             <div className="text-xs text-gray-500">{item.Type}</div>
//           </div>
//           <button
//             onClick={onDeleteItem}
//             className="absolute top-1 right-1 text-red-500 hover:text-red-700"
//           >
//             <XCircleIcon className="h-5 w-5" />
//           </button>
//         </>
//       ) : (
//         <button
//           onClick={onAddItem}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           <PlusCircleIcon className="h-8 w-8" />
//         </button>
//       )}
//     </div>
//   );
// };

const InventoryCard = ({ item, onAddItem, onEditItem, onDeleteItem }) => {
  const getIcon = (ItemType) => {
    switch (ItemType) {
      case 'weapon':
        return <SwordIcon className="h-6 w-6" />;
      case 'armour':
        return <ShieldIcon className="h-6 w-6" />;
      case 'material':
        return <CubeIcon className="h-6 w-6" />;
      case 'consumable':
        return <BeakerIcon className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        border border-gray-300 rounded p-2 flex flex-col items-center justify-center relative cursor-pointer
        transition-all duration-200 ease-in-out
        ${item ? 'bg-white' : 'bg-gray-100'}
        hover:scale-[1.05]
      `}
      style={{ width: '100px', height: '100px' }}
      onClick={item ? () => onEditItem(item) : onAddItem}
    >
      {item ? (
        <div className='flex flex-col justify-between items-center'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteItem(item);
            }}
            className="delete-item-btn absolute top-1 right-1 text-red-500 hover:text-red-700"
          >
            <XCircleIcon className="h-5 w-5" />
          </button>
          {getIcon(item.ItemType)}
          <div className="text-center text-xs mt-1 truncate w-full">{item.ItemName}</div>
        </div>
      ) : (
        <PlusCircleIcon className="h-8 w-8 text-blue-500 hover:text-blue-700 transition-transform duration-300 ease-in-out hover:rotate-360" />
      )}
    </div>
  );
};


export default InventoryCard;