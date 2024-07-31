// src/components/CampaignManagement.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const CampaignManagement = ({ campaigns }) => {
  const { campaignNumber } = useParams();
  const campaign = campaigns[parseInt(campaignNumber) - 1];

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Campaign Management {campaignNumber}</h2>
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-4">
        <h3 className="text-xl font-bold mb-2">{campaign.name}</h3>
        <p><strong>Length:</strong> {campaign.length}</p>
        <p><strong>Participants:</strong></p>
        <ul>
          {campaign.participants.map((participant, index) => (
            <li key={index}>{participant.name} - {participant.class}</li>
          ))}
        </ul>
        <p><strong>Difficulty:</strong> {campaign.difficulty}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to={`/campaigns/${campaignNumber}/character-creation`} className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 text-center">
          Character Creation
        </Link>
        <button className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700 transition duration-300">
          Option 2
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-700 transition duration-300">
          Option 3
        </button>
        <button className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300">
          Option 4
        </button>
      </div>
    </div>
  );
};

export default CampaignManagement;
