// src/components/MainContent.js
import React, { useState, useEffect } from 'react';
import EntityMainContent from '../EntityMainContent';


const Quests = ({ entities, createQuest, deleteQuest, editQuest, fetchAttributes, setEntities }) => {
    const quests = entities;

    const handleCreateQuest = (newQuest) => {
        return createQuest('quest', newQuest);
    };

    const handleEditQuest = (updatedQuest) => {
        return editQuest('quest', updatedQuest);
    };

    const handleDeleteQuest = (questId) => {
        return deleteQuest('quest', questId);
    };
    
    const fields = {
        'QuestID': null,
        'QuestName': null,
        'Description': null,
        'Status': ['In Progress', 'Completed'],
        'Progress': null,
    }

    return (
        <div>
            <EntityMainContent entity="Quest" setEntities={setEntities} fetchAttributes={fetchAttributes} fields={fields} entities={quests} onCreateEntity={handleCreateQuest} onDeleteEntity={handleDeleteQuest} onEditEntity={handleEditQuest} />
        </div>
    );
};


export default Quests;


