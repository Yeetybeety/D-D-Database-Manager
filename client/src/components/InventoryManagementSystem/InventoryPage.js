import React, { useState, useEffect } from 'react';
import InventoryList from './InventoryList';
import InventoryForm from './InventoryForm';
import DefaultButton from '../generic/DefaultButton';

const InventoryPage = () => {
  const [inventories, setInventories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, inventoryId: null });

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/inventories');
      if (!response.ok) {
        throw new Error('Failed to fetch inventories');
      }
      const data = await response.json();
      setInventories(data);
    } catch (err) {
      console.error('Error fetching inventories:', err);
      setError('An error occurred while fetching inventories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInventory = async (newInventory) => {
    try {
      const response = await fetch('/api/inventories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInventory),
      });
      if (!response.ok) {
        throw new Error(`Failed to add inventory: ${response.status} ${response.statusText}`);
      }
      const addedInventory = await response.json();
      setInventories(prevInventories => [...prevInventories, addedInventory]);
      setIsFormModalOpen(false);
    } catch (err) {
      console.error('Error adding inventory:', err);
    }
  };

  const handleEditInventory = (inventory) => {
    setEditingInventory(inventory);
    setIsFormModalOpen(true);
  };

  const handleUpdateInventory = async (updatedInventory) => {
    try {
      const response = await fetch(`/api/inventories/${updatedInventory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInventory),
      });
      if (!response.ok) {
        throw new Error('Failed to update inventory');
      }
      const updated = await response.json();
      setInventories(prevInventories => prevInventories.map(inv => inv.id === updated.id ? updated : inv));
      setIsFormModalOpen(false);
      setEditingInventory(null);
    } catch (err) {
      console.error('Error updating inventory:', err);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ isOpen: true, inventoryId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirmation.inventoryId;
    try {
      const response = await fetch(`/api/inventories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete inventory');
      }
      setInventories(prevInventories => prevInventories.filter(inventory => inventory.id !== id));
    } catch (err) {
      console.error('Error deleting inventory:', err);
    } finally {
      setDeleteConfirmation({ isOpen: false, inventoryId: null });
    }
  };

  if (isLoading) return <div>Loading inventories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
        <DefaultButton onClick={() => setIsFormModalOpen(true)}> Add New Inventory</DefaultButton>
      </div>
      <InventoryList
        inventories={inventories}
        onEdit={handleEditInventory}
        onDelete={handleDeleteClick}
        setInventories={setInventories}
      />
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <InventoryForm
              inventory={editingInventory}
              onSubmit={editingInventory ? handleUpdateInventory : handleAddInventory}
              onCancel={() => {
                setIsFormModalOpen(false);
                setEditingInventory(null);
              }}
            />
          </div>
        </div>
      )}
      {deleteConfirmation.isOpen && (
        <div id="popup-modal" tabIndex="-1" className="fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button onClick={() => setDeleteConfirmation({ isOpen: false, inventoryId: null })} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this inventory?</h3>
                <button onClick={handleDeleteConfirm} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                  Yes, I'm sure
                </button>
                <button onClick={() => setDeleteConfirmation({ isOpen: false, inventoryId: null })} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
