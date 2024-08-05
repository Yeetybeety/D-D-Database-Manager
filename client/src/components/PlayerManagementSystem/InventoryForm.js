import React, { useState, useEffect } from 'react';
import '../generic/styles.css'

const InventoryForm = ({ selectedItem, onSubmit, onCancel }) => {

    const [item, setItem] = useState(selectedItem || {
        ItemName: '',
        ItemType: 'weapon',
        Rarity: 'Common',
        Description: '',
        Durability: '',
        Attack: '',
        Defense: '',
        MaterialType: '',
        EffectType: '',
        EffectValue: '',
        Duration: '',
        Quantity: 1,
    });

    useEffect(() => {
        if (selectedItem) {
            setItem(selectedItem);
        }
    }, [selectedItem]);

    console.log(item);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem(prevItem => ({ ...prevItem, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(item);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-[400px]">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    name="ItemName"
                    value={item.ItemName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    name="ItemType"
                    value={item.ItemType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                    <option value="weapon">Weapon</option>
                    <option value="armour">Armour</option>
                    <option value="material">Material</option>
                    <option value="consumable">Consumable</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Rarity</label>
                <select
                    name="Rarity"
                    value={item.Rarity}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="Description"
                    value={item.Description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-24"
                />
            </div>
            {(item.ItemType === 'weapon' || item.ItemName === 'armour') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Durability</label>
                    <input
                        type="number"
                        name="Durability"
                        value={item.Durability}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
            )}
            {item.ItemType === 'weapon' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Attack</label>
                    <input
                        type="number"
                        name="Attack"
                        value={item.Attack}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
            )}
            {item.ItemType === 'armour' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Defense</label>
                    <input
                        type="number"
                        name="Defense"
                        value={item.Defense}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
            )}
            {item.ItemType === 'material' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Material Type</label>
                    <input
                        type="text"
                        name="MaterialType"
                        value={item.MaterialType}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
            )}
            {item.ItemType === 'consumable' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Effect Type</label>
                        <input
                            type="text"
                            name="EffectType"
                            value={item.EffectType}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Effect Value</label>
                        <input
                            type="number"
                            name="EffectValue"
                            value={item.EffectValue}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <input
                            type="number"
                            name="Duration"
                            value={item.Duration}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </>
            )}
            {(item.Type === 'material' || item.Type === 'consumable') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        name="Quantity"
                        value={item.Quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        min="1"
                    />
                </div>
            )}
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Add Item
                </button>
            </div>
        </form>
    );
};

export default InventoryForm;