// src/components/MainContent.js
import React, { useState } from 'react';
import EntityMainContent from '../EntityMainContent';


const Quests = () => {
    // Each entity manages its own 'entities' like this on their own component
    const [quests, setQuests] = useState([]);

    const handleCreateQuest = (newQuest) => {
        setQuests([...quests, { ...newQuest}]);
    };

    // this requires that the Title of the quest is unchangeable (kind of like the id/pk for it)
    const handleEditQuest = (updatedQuest) => {
        setQuests(quests.map(quest => 
          quest.Title === updatedQuest.Title ? { ...updatedQuest } : quest
        ));
      };

    const handleDeleteQuest = (title) => {
        setQuests(quests.filter((quest) => quest.Title !== title));
    };

    // Pass in fields so the 'Create' component knows which input fields to render
    const fields = {
        'Title': null,
        'Description': null,
        'Status': null,
        'Difficulty Level': ['Easy', 'Medium', 'Hard'],
    };

    // Render EntityMainContent and whatever else is unique to your entity page
    return (
        <div>
            <EntityMainContent entity="Quest" fields={fields} entities={quests} onCreateEntity={handleCreateQuest} onDeleteEntity={handleDeleteQuest} onEditEntity={handleEditQuest}/>
        </div>
    );
};


export default Quests;


