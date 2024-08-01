// src/components/PlayerPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerList from './PlayerList';
import PlayerForm from './PlayerForm';
import DefaultButton from '../generic/DefaultButton';
import Modal from '../generic/Modal';


const PlayerPage = () => {
  const [players, setPlayers] = useState([
    { id: 1, username: 'PlayerOne', class: 'Warrior', level: 10 },
    { id: 2, username: 'PlayerTwo', class: 'Mage', level: 8 },
    { id: 3, username: 'PlayerThree', class: 'Rogue', level: 12 },
    { id: 4, username: 'PlayerFour', class: 'Cleric', level: 9 },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleAddPlayer = (newPlayer) => {
    setPlayers([...players, { ...newPlayer, id: players.length + 1 }]);
    setIsAddModalOpen(false);
  };

  const handleEditPlayer = (id) => {
    navigate(`/player/edit/${id}`);
  };

  const handleDeletePlayer = (id) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPlayers = players.filter(player => 
    player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Player Management</h1>
        <DefaultButton onClick={() => setIsAddModalOpen(true)}>Add New Player</DefaultButton>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <PlayerList 
        players={filteredPlayers} 
        onEdit={handleEditPlayer} 
        onDelete={handleDeletePlayer} 
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <PlayerForm onSubmit={handleAddPlayer} />
      </Modal>
    </div>
  );
};

export default PlayerPage;