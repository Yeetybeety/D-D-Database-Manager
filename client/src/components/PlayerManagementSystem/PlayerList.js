// src/components/PlayerList.js
import React from 'react';
import PlayerCard from './PlayerCard';

const PlayerList = ({ players, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {players.map((player) => (
        <PlayerCard 
          key={player.id} 
          player={player} 
          onEdit={() => onEdit(player.id)} 
          onDelete={() => onDelete(player.id)} 
        />
      ))}
    </div>
  );
};

export default PlayerList;