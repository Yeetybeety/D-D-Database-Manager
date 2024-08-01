// src/components/Players.js
import React, { useState } from 'react';
import EntityMainContent from '../EntityMainContent';

const Players = () => {
    // Manage players in this component
    const [players, setPlayers] = useState([]);
    
    // Handle adding a new player
    const handleCreatePlayer = (newPlayer) => {
        setPlayers([...players, { ...newPlayer }]);
    };

    // Define the fields for the player entity
    const fields = {
        'Username': null,
        'Class': ['Warrior', 'Mage', 'Rogue'], // Example classes; adjust as needed
        'Level': null,
        'Exp': null,
        'Health': null,
        'MaxHealth': null,
        'Mana': null,
        'MaxMana': null,
        'Gold': null,
    };

    // Render EntityMainContent and any other unique components for the players page
    return (
        <div>
            <EntityMainContent entity="Player" fields={fields} entities={players} onCreateEntity={handleCreatePlayer} />
        </div>
    );
};

export default Players;
