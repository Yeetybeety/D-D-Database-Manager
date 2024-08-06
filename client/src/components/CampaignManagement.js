import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CampaignManagement = () => {
  const { campaignNumber } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, [campaignNumber]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }
      const data = await response.json();
      setCampaign(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError('An error occurred while fetching the campaign. Please try again later.');
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) return <div>Loading campaign...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Campaign Management {campaign.CampaignID}</h2>
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-4">
        <h3 className="text-xl font-bold mb-2">{campaign.Title}</h3>
        <p><strong>Start Date:</strong> {formatDate(campaign.StartDate)}</p>
        <p><strong>End Date:</strong> {formatDate(campaign.EndDate)}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/players" className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 text-center">
          Player Management
        </Link>
        <Link to="/location" className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 text-center">
          Location Management
        </Link>
        <Link to="/npc" className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-700 transition duration-300 text-center">
          NPC Tracker
        </Link>
        <Link to="/views" className="bg-orange-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-orange-700 transition duration-300 text-center">
          Projection of Tables
        </Link>
        <Link to="/" className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 text-center">
          Back to Main Page
        </Link>
      </div>
    </div>
  );
};

export default CampaignManagement;
