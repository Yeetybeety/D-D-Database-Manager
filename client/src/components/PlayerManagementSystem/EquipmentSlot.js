import React from 'react';
import { useDrop } from 'react-dnd';
import { PlusCircleIcon, SwordIcon, ShieldIcon, BeakerIcon } from '../generic/Icons';
import '../generic/styles.css';

const EquipmentSlot = ({ type, item, onEquip, onUnequip }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'inventoryItem',
    drop: (droppedItem) => onEquip(type, droppedItem),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const getIcon = (slotType) => {
    switch (slotType) {
      case 'weapon':
        return <SwordIcon className="h-6 w-6" />;
      case 'armour':
        return <ShieldIcon className="h-6 w-6" />;
      case 'consumable':
        return <BeakerIcon className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (item) {
      onUnequip(type, item);
    }
  };

  return (
    <div
      ref={drop}
      onClick={handleClick}
      className={`
        border border-gray-300 rounded p-2 flex flex-col items-center justify-center relative cursor-pointer
        transition-all duration-200 ease-in-out
        ${item ? 'bg-white' : 'bg-gray-100'}
        ${isOver ? 'border-blue-500' : ''}
        hover:scale-[1.05]
      `}
      style={{ width: '100px', height: '100px' }}
    >
      {item ? (
        <div className='flex flex-col justify-between items-center'>
          {getIcon(item.ItemType)}
          <div className="text-center text-xs mt-1 truncate w-full">{item.ItemName}</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {getIcon(type)}
          <div className="text-center text-xs mt-1">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
        </div>
      )}
    </div>
  );
};

export default EquipmentSlot;