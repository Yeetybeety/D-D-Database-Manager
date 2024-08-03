import React from 'react';
import EntityMainContent from '../EntityMainContent';

const NPC = ({ entities, createNPC, deleteNPC, editNPC }) => {
    const npcs = entities;

    const handleCreateNPC = (newNPC) => {
        createNPC('NPC2', newNPC);
    };

    const handleEditNPC = (updatedNPC) => {
        editNPC('NPC2', updatedNPC);
    };

    const handleDeleteNPC = (npcId) => {
        deleteNPC('NPC2', npcId);
    };

    // Define fields for NPC with specific selection options
    const fields = {
        'NPC2ID': null, // Primary key, generally not editable by users
        'NPCName': null,
        'Description': null,
        'Race': ['Goblin', 'Juggernaut', 'Dwarf', 'Elf'], // Dropdown selection options
        'Level': null,
        'Health': null,
        'AIBehaviour': ['Friendly', 'Hostile', 'Neutral', 'Harold'], // Dropdown selection options
        'LocationID': null, // Typically a foreign key, may require a separate selection component or input
    };


    return (
        <div>
            <EntityMainContent
                entity="NPC"
                fields={fields}
                entities={npcs}
                onCreateEntity={handleCreateNPC}
                onEditEntity={handleEditNPC}
                onDeleteEntity={handleDeleteNPC}
            />
        </div>
    );
};

export default NPC;
