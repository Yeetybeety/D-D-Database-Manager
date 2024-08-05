import React, { useState } from 'react';
import Card from '../generic/Card';
import DefaultButton from '../generic/DefaultButton';

const InventoryCountButton = ({ playerId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryCount, setInventoryCount] = useState(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const fetchInventoryCount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/players/${playerId}/inventory/count`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory count');
      }
      const data = await response.json();
      setInventoryCount(data.result);
      setIsCardVisible(true);
    } catch (error) {
      console.error('Error fetching inventory count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mt-2 w-[400px]'>
      {!isCardVisible ? (
        <DefaultButton onClick={fetchInventoryCount} disabled={isLoading} variant="primary">
          {isLoading ? 'Loading...' : 'Show Inventory Count'}
        </DefaultButton>
      ) : (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Inventory Count</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Item Type</th>
                  <th className="py-2 px-4 border-b text-left">Count</th>
                </tr>
              </thead>
              <tbody>
                {inventoryCount?.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b">{item.ItemType}</td>
                    <td className="py-2 px-4 border-b">{item.Count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DefaultButton 
            onClick={() => setIsCardVisible(false)} 
            variant="destructive" 
            className="mt-4"
          >
            Close
          </DefaultButton>
        </Card>
      )}
    </div>
  );
};

export default InventoryCountButton;