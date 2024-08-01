import React, { useState } from 'react';
import EntityMainContent from '../EntityMainContent';

const Items = () => {
    const [items, setItems] = useState([]);

    const handleCreateItem = (newItem) => {
        setItems([...items, { ...newItem }]);
    };

    const fields = {
        'Item Name': null,
        'Item ID': null,
        'Description': null,
        'Rarity': ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
        'Item Type': ['Weapon', 'Armor', 'Potion', 'Accessory'],
    };

    return (
        <div>
            <EntityMainContent 
                entity="Item" 
                fields={fields} 
                entities={items} 
                onCreateEntity={handleCreateItem} 
            />
        </div>
    );
};

export default Items;
