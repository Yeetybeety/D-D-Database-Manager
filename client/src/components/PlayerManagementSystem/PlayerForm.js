import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PlayerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    username: '',
    class: '',
    level: '',
    exp: '',
    health: '',
    mana: '',
    gold: ''
  });

  useEffect(() => {
    if (id) {
      // This will be replaced with actual data fetching later
      setPlayer({
        username: 'PlayerOne',
        class: 'Warrior',
        level: '10',
        exp: '2500',
        health: '100',
        mana: '50',
        gold: '500'
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This will be replaced with actual API call later
    console.log(player);
    navigate('/');
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {id ? 'Edit Player' : 'Add New Player'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input type="text" name="username" id="username" value={player.username} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter username" required />
            </div>
            <div className="w-full">
              <label htmlFor="class" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Class</label>
              <input type="text" name="class" id="class" value={player.class} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter class" required />
            </div>
            <div className="w-full">
              <label htmlFor="level" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Level</label>
              <input type="number" name="level" id="level" value={player.level} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter level" required />
            </div>
            <div className="w-full">
              <label htmlFor="exp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Experience</label>
              <input type="number" name="exp" id="exp" value={player.exp} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter experience" required />
            </div>
            <div className="w-full">
              <label htmlFor="health" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Health</label>
              <input type="number" name="health" id="health" value={player.health} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter health" required />
            </div>
            <div className="w-full">
              <label htmlFor="mana" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mana</label>
              <input type="number" name="mana" id="mana" value={player.mana} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter mana" required />
            </div>
            <div className="w-full">
              <label htmlFor="gold" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gold</label>
              <input type="number" name="gold" id="gold" value={player.gold} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter gold" required />
            </div>
          </div>
          <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            {id ? 'Update Player' : 'Add Player'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default PlayerForm;