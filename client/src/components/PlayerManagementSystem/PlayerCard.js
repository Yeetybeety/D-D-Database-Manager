import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../generic/DefaultButton';
import { CoinIcon, DeadIcon } from '../generic/Icons';
import ProgressBar from './PlayerProgressBar';

/* 
  This component is used to display a player card in PlayerPage
  player: player db object
  onEdit: function to handle edit button click (playerPage)
  onDelete: function to handle delete button click (playerPage)
  setPlayers: function to update players state (playerPage)
*/
const PlayerCard = ({ player, onEdit, onDelete, setPlayers }) => {

  // Revives the player if the player is dead
  const isDead = player.Health <= 0;
  const handleRevive = () => {
    setPlayers(prevPlayers => prevPlayers.map(p =>
      p.PlayerID === player.PlayerID
        ? { ...p, Health: p.MaxHealth }
        : p
    ));
  };

  return (
    <div className="relative max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

      {/* Display Player Information */}
      <div className="player-info">
        <Link to={`/players/${player.PlayerID}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{player.Username}</h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Level {player.Level} {player.Class}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          EXP: {player.Exp}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex items-center">
          Gold: {player.Gold} <CoinIcon />
        </p>
      </div>

      {/* Bars for HP and MP */}
      {isDead ? (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-bold">{player.Username} is dead.</p>
          <Button
            onClick={handleRevive}
            variant="revival"
          >
            Revive
          </Button>
        </div>
      ) : (
        <>
          <ProgressBar
            current={player.Health}
            max={player.MaxHealth}
            label="HP"
            color="bg-red-600"
          />
          <ProgressBar
            current={player.Mana}
            max={player.MaxMana}
            label="MP"
            color="bg-blue-600"
          />
        </>
      )}

      {/* Button Panel for each player card */}
      <div className="flex justify-between">
        <Link to={`/players/${player.PlayerID}`}>
          <Button variant="primary">View Details</Button>
        </Link>
        <Button onClick={onEdit} variant="primary">Edit</Button>
        <Button onClick={onDelete} variant="destructive">Delete</Button>
      </div>

    </div>
  );
};

export default PlayerCard;