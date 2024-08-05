// src/components/MainContent.js
import React, { useState, useEffect } from 'react';
import EntityMainContent from '../EntityMainContent';


const Quests = ({ entities, createQuest, deleteQuest, editQuest }) => {

    const quests = entities
    console.log(quests);

    const handleCreateQuest = (newQuest) => {
        createQuest('quest', newQuest);
    };

    const handleEditQuest = (updatedQuest) => {
        editQuest('quest', updatedQuest);
    };

    const handleDeleteQuest = (questId) => {
       deleteQuest('quest', questId);
    };

    // Pass in fields so the 'Create' component knows which input fields to render
    const fields = {
        'QuestID': null,
        'QuestName': null,
        'Description': null,
        'Status': ['In Progress', 'Completed'],
        'Progress': null,
    }

    // Render EntityMainContent and whatever else is unique to your entity page
    return (
        <div>
            <EntityMainContent entity="Quest" fields={fields} entities={quests} onCreateEntity={handleCreateQuest} onDeleteEntity={handleDeleteQuest} onEditEntity={handleEditQuest} />
        </div>
    );
};


export default Quests;


