import React, { useState, useEffect } from 'react';

const PlayerForm = ({ player, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    PlayerID: '',
    Username: '',
    ClassType: '',
    Level: '',
    MaxHealth: '',
    MaxMana: '',
    Gold: '',
    Exp: '',
    Health: '',
    Mana: ''
  });

  useEffect(() => {
    if (player) {
      setFormData({
        PlayerID: player.PlayerID || '',
        Username: player.Username || '',
        ClassType: player.Class || '',
        Level: player.Level || '',
        MaxHealth: player.MaxHealth || '',
        MaxMana: player.MaxMana || '',
        Gold: player.Gold || '',
        Exp: player.Exp || '',
        Health: player.Health || '',
        Mana: player.Mana || ''
      });
    }
  }, [player]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {player ? 'Edit Player' : 'Add New Player'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="w-full">
              <label htmlFor="Username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input
                type="text"
                name="Username"
                id="Username"
                value={formData.Username}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="ClassType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Class</label>
              <input
                type="text"
                name="ClassType"
                id="ClassType"
                value={formData.ClassType}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter class"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="Level" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Level</label>
              <input
                type="number"
                name="Level"
                id="Level"
                value={formData.Level}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter level"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="Exp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Experience</label>
              <input
                type="number"
                name="Exp"
                id="Exp"
                value={formData.Exp}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter experience"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="Health" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Health</label>
              <input
                type="number"
                name="Health"
                id="Health"
                value={formData.Health}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter current health"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="MaxHealth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Max Health</label>
              <input
                type="number"
                name="MaxHealth"
                id="MaxHealth"
                value={formData.MaxHealth}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter max health"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="Mana" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Mana</label>
              <input
                type="number"
                name="Mana"
                id="Mana"
                value={formData.Mana}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter current mana"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="MaxMana" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Max Mana</label>
              <input
                type="number"
                name="MaxMana"
                id="MaxMana"
                value={formData.MaxMana}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter max mana"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="Gold" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gold</label>
              <input
                type="number"
                name="Gold"
                id="Gold"
                value={formData.Gold}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter gold"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {player ? 'Save Changes' : 'Add Player'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PlayerForm;