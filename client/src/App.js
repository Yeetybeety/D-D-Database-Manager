// src/App.js
import React, { useState } from 'react';
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
import Inventory from './components/routes/Inventory';

const App = () => {
  const [campaigns, setCampaigns] = useState([]);

  const handleCreateCampaign = (newCampaign) => {
    setCampaigns([...campaigns, { ...newCampaign, participants: [] }]);
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
          <Route path="/npc" element={<NPC />} />
          <Route path="/items" element={<Items />} />
          <Route path="/event-logs" element={<EventLogs />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/inventory" element={<Inventory />} />
          {/* Change the route below to go to an edit page? */}
          <Route path="/:route/:campaignNumber" element={<CampaignManagement campaigns={campaigns} />} />
          <Route path="/campaigns/:campaignNumber" element={<CampaignManagement campaigns={campaigns} />} />
          <Route path="/campaigns/:campaignNumber/character-creation" element={<CharacterCreation campaigns={campaigns} setCampaigns={setCampaigns} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;