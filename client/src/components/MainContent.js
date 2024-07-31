// src/components/MainContent.js
import React, { useState } from 'react';
import CampaignButton from './CampaignButton';
import CampaignCreation from './CampaignCreation';
import Modal from './Modal';

const MainContent = ({ campaigns, onCreateCampaign }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateCampaign = (newCampaign) => {
    onCreateCampaign(newCampaign);
    setShowModal(false);
  };

  return (
    <main className="flex-grow p-4">
      <div className="container mx-auto">
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-4">
          <h2 className="text-xl font-bold mb-4">Welcome to My App</h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 mb-4"
            onClick={() => setShowModal(true)}
          >
            Create Campaign
          </button>
        </div>
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <CampaignCreation onCreateCampaign={handleCreateCampaign} onClose={() => setShowModal(false)} />
        </Modal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {campaigns.map((campaign, index) => (
            <CampaignButton key={index} campaignNumber={index + 1} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
