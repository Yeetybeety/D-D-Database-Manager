// src/components/CampaignButton.js
import React from 'react';
import { Link } from 'react-router-dom';

const CampaignButton = ({ campaignNumber }) => {
  return (
    <Link to={`/campaigns/${campaignNumber}`} className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 text-center">
      Manage Campaign {campaignNumber}
    </Link>
  );
};

export default CampaignButton;
