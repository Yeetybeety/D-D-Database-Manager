import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../generic/DefaultButton';
import Tooltip from '../generic/Tooltip';

/**
 * Fetches inventory details from server.
 * @param {string} inventoryId - The ID of the inventory item.
 * @returns {Promise<object>} - The inventory item details.
 */
const fetchInventoryDetails = async (inventoryId) => {
  try {
    const response = await fetch(`/api/inventories/${inventoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching inventory details:', error);
    throw error;
  }
};

const InventoryDetails = () => {
  const { id } = useParams();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInventoryDetails = async () => {
      try {
        const data = await fetchInventoryDetails(id);
        setInventory(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load inventory details');
        setLoading(false);
      }
    };

    loadInventoryDetails();
  }, [id]);

  const updateInventoryDetails = async (inventoryId, updatedData) => {
    try {
      const response = await fetch(`/api/inventories/${inventoryId}/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to update inventory details');
      }
      setInventory(updatedData);
      return await response.json();
    } catch (error) {
      console.error('Error updating inventory details:', error);
      throw error;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!inventory) return <div>Inventory not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{inventory.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="inventory-details-left">
          <h2 className="text-xl font-semibold mb-2">Inventory Details</h2>
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{inventory.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Type:</span>
              <span>{inventory.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Quantity:</span>
              <span>{inventory.quantity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails;
