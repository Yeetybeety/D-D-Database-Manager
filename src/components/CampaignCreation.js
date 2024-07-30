// src/components/CampaignCreation.js
import React, { useState } from 'react';

const CampaignCreation = ({ onCreateCampaign, onClose }) => {
  const [campaign, setCampaign] = useState({
    name: '',
    length: '',
    participants: '',
    difficulty: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign({
      ...campaign,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateCampaign(campaign);
    onClose();  // Close the modal after creating a campaign
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Campaign Name</label>
          <input type="text" id="name" name="name" value={campaign.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="length">Campaign Length</label>
          <input type="text" id="length" name="length" value={campaign.length} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="participants">Participants</label>
          <input type="text" id="participants" name="participants" value={campaign.participants} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">Difficulty Level</label>
          <select id="difficulty" name="difficulty" value={campaign.difficulty} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Campaign</button>
        </div>
      </form>
    </div>
  );
};

export default CampaignCreation;
