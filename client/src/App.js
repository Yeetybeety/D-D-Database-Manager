// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import CampaignManagement from './components/CampaignManagement';
import CharacterCreation from './components/CharacterCreation';
import Quests from './components/routes/Quests';
import PlayerPage from './components/PlayerManagementSystem/PlayerPage';
import PlayerForm from './components/PlayerManagementSystem/PlayerForm';
// import PlayerDetails from './components/PlayerManagementSystem/PlayerCard';
import PlayerDetails from './components/PlayerManagementSystem/PlayerDetails';
import NPC from './components/routes/NPC';
import Items from './components/routes/Items';
import EventLogs from './components/routes/EventLog';
import Locations from './components/routes/Locations';
import Equipment from './components/routes/Equipment';


const App = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [quests, setQuests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [npcs, setNpcs] = useState([]);
  const [eventLogs, setEventLogs] = useState([]);
  const [equipment, setEquipment] = useState([]);


  const entityList = ['quest', 'location', 'item', 'NPC2', 'eventLog', 'equipment'];


  const handleCreateCampaign = (newCampaign) => {
    setCampaigns([...campaigns, { ...newCampaign, participants: [] }]);
  };

  const fetchEntities = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:3001/api/${endpoint}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
      // Add more conditions here if you need to handle other endpoints
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    entityList.forEach((entity, index) => {
      console.log('Fetching', entity);
      updateEntityState(entity);
    });
  }, []);

  const handleCreateEntity = async (entity, newEntity) => {
    try {
      const response = await fetch(`http://localhost:3001/api/${entity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntity),
      });

      if (!response.ok) {
        throw new Error(`Failed to create ${entity}`);
      }

      // const createdEntity = await response.json();

      updateEntityState(entity);
    } catch (error) {
      console.error(`Error creating ${entity}:`, error);
    }
  };

  const handleDeleteEntity = async (entity, entityId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/${entity}/${entityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${entity}`);
      }
      updateEntityState(entity);
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error);
    }
  };


  const handleEditEntity = async (entity, updatedEntity) => {
    try {
      const response = await fetch(`http://localhost:3001/api/${entity}/${updatedEntity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEntity),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit ${entity}`);
      }

      // const updated = await response.json();

      updateEntityState(entity);
    } catch (error) {
      console.error(`Error editing ${entity}:`, error);
    }
  };


  const updateEntityState = async (entity) => {
    switch (entity) {
      case 'quest':
        setQuests(await fetchEntities('quest'));
        break;
      case 'location':
        setLocations(await fetchEntities('location'));
        break;
      case 'item':
        setItems(await fetchEntities('item'));
        break;
      case 'NPC2':
        setNpcs(await fetchEntities('NPC2'));
        break;
      case 'eventLog':
        setEventLogs(await fetchEntities('eventLog'));
        break;
      case 'equipment':
        setEquipment(await fetchEntities('equipment'));
        break;
      // Add more cases for other entities
      default:
        console.error('Unknown entity type:', entity);
    }
  };
  


  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<MainContent campaigns={campaigns} onCreateCampaign={handleCreateCampaign} />} />
          {/* Routes */}
          <Route path="/quests" element={<Quests />} />
          <Route path="/players" element={<PlayerPage />} />
          <Route path="/players/:id" element={<PlayerDetails />} />
          <Route path="/player/edit/:id" element={<PlayerForm />} />
          {/* Change the route below to go to an edit page? */}
          <Route path="/quest" element={<Quests entities={quests} createQuest={handleCreateEntity} editQuest={handleEditEntity} deleteQuest={handleDeleteEntity} />} />
          <Route path="/location" element={<Locations entities={locations} createLocation={handleCreateEntity} editLocation={handleEditEntity} deleteLocation={handleDeleteEntity} />} />
          <Route path="/item" element={<Items entities={items} createItem={handleCreateEntity} editItem={handleEditEntity} deleteItem={handleDeleteEntity} />} />
          <Route path="/npc" element={<NPC entities={npcs} createNPC={handleCreateEntity} editNPC={handleEditEntity} deleteNPC={handleDeleteEntity} />} />
          <Route path="/event-logs" element={<EventLogs entities={eventLogs} createEventLog={handleCreateEntity} editEventLog={handleEditEntity} deleteEventLog={handleDeleteEntity} />} />
          <Route path="/equipment" element={<Equipment entities={equipment} createEquipment={handleCreateEntity} editEquipment={handleEditEntity} deleteEquipment={handleDeleteEntity} />} />
          <Route path="/:route/:campaignNumber" element={<CampaignManagement campaigns={campaigns} />} />
          <Route path="/campaigns/:campaignNumber" element={<CampaignManagement campaigns={campaigns} />} />
          <Route path="/campaigns/:campaignNumber/character-creation" element={<CharacterCreation campaigns={campaigns} setCampaigns={setCampaigns} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;