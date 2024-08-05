import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PlayerInventory = ({ inventory = [], onAddItemClick, onDeleteItemClick }) => {
    const { id: playerId } = useParams();
    const [itemCount, setItemCount] = useState(0);

    const countItems = async () => {
        try {
            const response = await fetch(`/api/players/${playerId}/inventory/count`);
            if (!response.ok) {
                throw new Error('Failed to fetch inventory count');
            }
            const data = await response.json();
            console.log('Count Response:', data);
            setItemCount(data.totalQuantity);
        } catch (error) {
            console.error('Error fetching inventory count:', error);
        }
    };

    useEffect(() => {
        if (playerId) {
            countItems();
        }
    }, [playerId, inventory]); // Run the countItems function whenever playerId or inventory changes

    return (
        <div>
            <div className="flex justify-between mb-4">
                <span>Total Items: {itemCount}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-4">
                {inventory.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-200 border border-gray-300 rounded flex items-center justify-center relative p-2 min-w-[4rem]"
                        style={{ minHeight: '2.5rem' }}
                    >
                        {item ? (
                            <>
                                <span className="text-center">{item.ItemName}</span>
                                <button
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    onClick={() => onDeleteItemClick(index)}
                                >
                                    x
                                </button>
                            </>
                        ) : (
                            <button
                                className="bg-blue-500 text-white rounded-full p-1"
                                onClick={() => onAddItemClick(index)}
                            >
                                +
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerInventory;
