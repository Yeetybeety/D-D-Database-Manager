import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableInventoryItem = ({ item, index, moveItem }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'inventoryItem',
    item: { ...item, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'inventoryItem',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`border border-gray-300 rounded p-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <img src={`/icons/${item.ItemType}.png`} alt={item.ItemName} className="w-16 h-16" />
      <div className="text-xs text-center mt-1">{item.ItemName}</div>
    </div>
  );
};

export default DraggableInventoryItem;