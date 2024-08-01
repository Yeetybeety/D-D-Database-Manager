import React, { useState } from 'react';
import EntityMainContent from '../EntityMainContent';

const NPC = () => {
    const [npcs, setNPCs] = useState([]);

    const handleCreateNPC = (newNPC) => {
        setNPCs([...npcs, { ...newNPC }]);
    };

    // Define fields for NPC with specific selection options
    const fields = {
        'NPC Name': null,
        'Description': null,
        'Race': ['Goblin', 'Juggernaut', 'Dwarf', 'Elf'],
        'Level': null,
        'Health': null,
        'Max Health': null,
        'AI Behaviour': ['Friendly', 'Hostile', 'Neutral', 'Harold'],
    };

    // Render EntityMainContent and any additional components specific to NPCs
    return (
        <div>
            <EntityMainContent 
                entity="NPC" 
                fields={fields} 
                entities={npcs} 
                onCreateEntity={handleCreateNPC} 
            />
        </div>
    );
};

export default NPC;
