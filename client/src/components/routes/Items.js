import React from 'react';
import EntityMainContent from '../EntityMainContent';

const Items = ({ entities, createItem, deleteItem, editItem, setEntities, fetchAttributes }) => {
    const items = entities

    const handleCreateItem = (newItem) => {
        createItem('item', newItem);
    };

    const handleEditItem = (updatedItem) => {
        editItem('item', updatedItem);
    };

    const handleDeleteItem = (itemId) => {
        deleteItem('item', itemId);
    };

    // Pass in fields so the 'Create' component knows which input fields to render
    const fields = {
        'ItemID': null,
        'ItemName': null,
        'Description': null,
        'Rarity': ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
        'ItemType': ['Weapon', 'Armor', 'Potion', 'Accessory'],
    };

    return (
        <div>
            <EntityMainContent 
                entity="Item" 
                fields={fields} 
                entities={items} 
                onCreateEntity={handleCreateItem} 
                onDeleteEntity={handleDeleteItem} 
                onEditEntity={handleEditItem} 
                setEntities={setEntities} 
                fetchAttributes={fetchAttributes}
            />
        </div>
    );
};

export default Items;
