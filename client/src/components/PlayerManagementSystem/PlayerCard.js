// src/components/PlayerCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../generic/DefaultButton';

const PlayerCard = ({ player, onEdit, onDelete }) => {
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/player/${player.id}`}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{player.username}</h5>
      </Link>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Level {player.level} {player.class}
      </p>
      <div className="flex justify-between">
        <Link to={`/player/${player.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <Button onClick={onEdit} variant="outline">Edit</Button>
        <Button onClick={onDelete} variant="destructive">Delete</Button>
      </div>
    </div>
  );
};

export default PlayerCard;