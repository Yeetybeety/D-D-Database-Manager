import React from 'react';
import { Link } from 'react-router-dom';

const CampaignButton = ({ campaign, onDelete }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg flex justify-between items-center">
      <Link to={`/campaigns/${campaign.CampaignID}`} className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 text-center block flex-grow mr-2">
        {campaign.Title}
      </Link>
      <button 
        onClick={() => onDelete(campaign.CampaignID)}
        className="text-red-500 hover:text-red-700 transition duration-300"
        title="Delete"
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default CampaignButton;
