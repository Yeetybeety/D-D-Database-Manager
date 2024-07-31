// src/components/CharacterCreation.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CharacterCreation = ({ campaigns, setCampaigns }) => {
  const [character, setCharacter] = useState({
    name: '',
    hairStyle: '',
    height: '',
    race: '',
    class: '',
  });

  const navigate = useNavigate();
  const { campaignNumber } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacter({
      ...character,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCampaigns = [...campaigns];
    updatedCampaigns[campaignNumber - 1].participants.push(character);

    setCampaigns(updatedCampaigns);
    navigate(`/campaigns/${campaignNumber}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create Character</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={character.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hairStyle">Hair Style</label>
          <select id="hairStyle" name="hairStyle" value={character.hairStyle} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Hair Style</option>
            <option value="Short">Short</option>
            <option value="Long">Long</option>
            <option value="Curly">Curly</option>
            <option value="Straight">Straight</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="height">Height</label>
          <input type="text" id="height" name="height" value={character.height} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="race">Race</label>
          <select id="race" name="race" value={character.race} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Race</option>
            <option value="Human">Human</option>
            <option value="Elf">Elf</option>
            <option value="Dwarf">Dwarf</option>
            <option value="Orc">Orc</option>
            <option value="Halfling">Halfling</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">Class</label>
          <select id="class" name="class" value={character.class} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select Class</option>
            <option value="Warrior">Warrior</option>
            <option value="Mage">Mage</option>
            <option value="Rogue">Rogue</option>
            <option value="Cleric">Cleric</option>
            <option value="Ranger">Ranger</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Character</button>
        </div>
      </form>
    </div>
  );
};

export default CharacterCreation;
