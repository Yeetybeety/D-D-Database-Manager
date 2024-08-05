import React, { useState, useEffect } from 'react';
import CampaignButton from './CampaignButton';
import CampaignCreation from './CampaignCreation';
import Modal from './Modal';

const MainContent = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const handleCreateCampaign = async (newCampaign) => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCampaign),
      });
      if (!response.ok) {
        throw new Error('Failed to add campaign');
      }
      const addedCampaign = await response.json();
      setCampaigns([...campaigns, addedCampaign]);
      setShowModal(false);
    } catch (err) {
      console.error('Error adding campaign:', err);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }
      setCampaigns(campaigns.filter(campaign => campaign.CampaignID !== campaignId));
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
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
          {campaigns.map((campaign) => (
            <CampaignButton key={campaign.CampaignID} campaign={campaign} onDelete={handleDeleteCampaign} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
