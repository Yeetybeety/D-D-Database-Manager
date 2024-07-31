// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import CampaignManagement from './components/CampaignManagement';
import CharacterCreation from './components/CharacterCreation';

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
          <Route path="/campaigns/:campaignNumber" element={<CampaignManagement campaigns={campaigns} />} />
          <Route path="/campaigns/:campaignNumber/character-creation" element={<CharacterCreation campaigns={campaigns} setCampaigns={setCampaigns} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
