// src/components/PlayerList.js
import React from 'react';
import PlayerCard from './PlayerCard';

const PlayerList = ({ players, onEdit, onDelete }) => {

  console.log('Players in PlayerList:', players);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {/* map out list of all players */}
      {players.map((player) => (
        <PlayerCard 
          key={player.PlayerID} 
          player={player} 
          onEdit={() => onEdit(player)} 
          onDelete={() => onDelete(player.PlayerID)} 
        />
      ))}

    </div>
  );
};

export default PlayerList;