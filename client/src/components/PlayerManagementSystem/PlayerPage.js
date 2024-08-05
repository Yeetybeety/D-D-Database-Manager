// src/components/PlayerPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerList from './PlayerList';
import PlayerForm from './PlayerForm';
import DefaultButton from '../generic/DefaultButton';
import Card from '../generic/Card';

const PlayerPage = () => {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, playerId: null });
  const [averageGoldByClass, setAverageGoldByClass] = useState([]);
  const [collectionMessage, setCollectionMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
    fetchAverageGoldByClass();
  }, []);

  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/players');
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('An error occurred while fetching players. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAverageGoldByClass = async () => {
    try {
      const response = await fetch('/api/players/average-gold-by-class');
      if (!response.ok) {
        throw new Error('Failed to fetch average gold by class');
      }
      const data = await response.json();
      console.log('Fetched Average Gold by Class:', data);
      setAverageGoldByClass(data);
    } catch (err) {
      console.error('Error fetching average gold by class:', err);
    }
  };

  const handleAddPlayer = async (newPlayer) => {
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });
      if (!response.ok) {
        throw new Error(`Failed to add player: ${response.status} ${response.statusText}`);
      }

      const addedPlayer = await response.json();
      setPlayers(prevPlayers => [...prevPlayers, addedPlayer]);
      setIsFormModalOpen(false);
      fetchAverageGoldByClass(); // Update the average gold by class after adding a player
    } catch (err) {
      console.error('Error adding player:', err);
      // TODO: Implement user-facing error message
    }
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    console.log('Editing player:', player);
    setIsFormModalOpen(true);
  };

  const handleUpdatePlayer = async (updatedPlayer) => {
    console.log('Updating player:', updatedPlayer);
    try {
      const response = await fetch(`/api/players/${updatedPlayer.PlayerID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPlayer),
      });
      if (!response.ok) {
        throw new Error('Failed to update player');
      }
      const updated = await response.json();
      setPlayers(prevPlayers => prevPlayers.map(p => p.PlayerID === updated.PlayerID ? updated : p));
      setIsFormModalOpen(false);
      setEditingPlayer(null);
      fetchAverageGoldByClass(); // Update the average gold by class after updating a player
    } catch (err) {
      console.error('Error updating player:', err);
      // TODO: Implement user-facing error message
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ isOpen: true, playerId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirmation.playerId;
    try {
      const response = await fetch(`/api/players/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete player');
      }
      setPlayers(prevPlayers => prevPlayers.filter(player => player.PlayerID !== id));
      fetchAverageGoldByClass(); // Update the average gold by class after deleting a player
    } catch (err) {
      console.error('Error deleting player:', err);
      // TODO: Implement user-facing error message
    } finally {
      setDeleteConfirmation({ isOpen: false, playerId: null });
    }
  };

  const handleFindCollector = async () => {
    try {
      const response = await fetch('/api/players/collected-all-items');
      if (!response.ok) {
        throw new Error('Failed to fetch the players who collected all items');
      }
      const data = await response.json();
      setCollectionMessage(data.message);
    } catch (err) {
      console.error('Frontend Error:', err);
      setCollectionMessage('An error occurred while fetching the players who collected all items.');
    }
  };

  if (isLoading) return <div>Loading players...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Player Management</h1>
        <DefaultButton onClick={() => setIsFormModalOpen(true)}> Add New Player</DefaultButton>
      </div>

      <div className="mb-6">
        <DefaultButton onClick={handleFindCollector}>Find Player Who Collected All Items</DefaultButton>
        {collectionMessage && (
          <div className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            {collectionMessage}
          </div>
        )}
      </div>

      <PlayerList
        players={players}
        onEdit={handleEditPlayer}
        onDelete={handleDeleteClick}
        setPlayers={setPlayers}
      />

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <PlayerForm
              player={editingPlayer}
              onSubmit={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
              onCancel={() => {
                setIsFormModalOpen(false);
                setEditingPlayer(null);
              }}
            />
          </div>
        </div>
      )}

      {deleteConfirmation.isOpen && (
        <div id="popup-modal" tabIndex="-1" className="fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button onClick={() => setDeleteConfirmation({ isOpen: false, playerId: null })} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this player?</h3>
                <button onClick={handleDeleteConfirm} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                  Yes, I'm sure
                </button>
                <button onClick={() => setDeleteConfirmation({ isOpen: false, playerId: null })} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Card additionalClasses='w-[360px] mt-10'>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Average Gold by Class</h2>
        <ul>
          {averageGoldByClass.map(({ Class, averageGold }) => (
            <li key={Class}>
              {Class}: {Number(averageGold).toFixed(2)}
            </li>
          ))}
        </ul>
      </Card>

    </div>
  );
};

export default PlayerPage;
