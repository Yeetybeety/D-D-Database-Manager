import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { PlusCircleIcon, XCircleIcon, SwordIcon, ShieldIcon, CubeIcon, BeakerIcon } from '../generic/Icons';
import '../generic/styles.css';

const InventoryCard = ({ item, index, onAddItem, onEditItem, onDeleteItem, moveItem }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'inventoryItem',
    item: () => ({ ...item, index }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'inventoryItem',
    hover(draggedItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

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
      ref={ref}
      className={`
        border border-gray-300 rounded p-2 flex flex-col items-center justify-center relative cursor-pointer
        transition-all duration-200 ease-in-out
        ${item ? 'bg-white' : 'bg-gray-100'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
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