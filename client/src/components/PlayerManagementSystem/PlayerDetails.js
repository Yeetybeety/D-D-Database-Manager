import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CoinIcon } from '../generic/Icons';
import Button from '../generic/DefaultButton';
import ProgressBar from './PlayerProgressBar';
import PlayerInventory from './PlayerInventory';
import Tooltip from '../generic/Tooltip';
import StatDisplay from '../generic/StatDisplay';
import InventoryForm from './InventoryForm';

// Fetches player details from server, including player stats
const fetchPlayerDetails = async (playerId) => {
    try {
        const response = await fetch(`/api/players/${playerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch player details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching player details:', error);
        throw error;
    }
};

// Fetches player inventory by playerId
const fetchPlayerInventory = async (playerId) => {
    try {
        const response = await fetch(`/api/players/${playerId}/inventory`);
        if (!response.ok) {
            throw new Error('Failed to fetch player details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching player details:', error);
        throw error;
    }
};

// Temp display for stats
const SimpleDisplay = ({ label, value, icon }) => (
    <div className="flex justify-between">
        <span className="font-medium">{label}:</span>
        <div className="flex">
            <span>{value}</span>
            {icon ? <CoinIcon className="ml-1" /> : null}
        </div>
    </div>
);

// Sample function to process and fill the array
function fillItemNames(itemList) {
    // Initialize an array of size 20 filled with null values
    const resultArray = new Array(20).fill(null);
  
    // Extract item names from the list of JSON objects
    const itemNames = itemList.map(item => item.ItemName);
  
    // Place item names into the result array
    for (let i = 0; i < itemNames.length && i < 20; i++) {
      resultArray[i] = itemNames[i];
    }
  
    return resultArray;
  }

const PlayerDetails = ({ ownedItems }) => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const loadPlayerDetails = async () => {
            try {
                const data = await fetchPlayerDetails(id);
                const playerInventory = await fetchPlayerInventory(id);
                console.log(playerInventory);
                // data.inventory = data.inventory || Array(20).fill(null); // Ensure inventory is initialized
                data.inventory = fillItemNames(playerInventory);
                console.log(data.inventory);
                setPlayer(data);
                setNotes(data.Notes || '');
                setLoading(false);
            } catch (err) {
                setError('Failed to load player details');
                setLoading(false);
            }
        };

        loadPlayerDetails();
    }, [id]);

    const updatePlayerDetails = async (playerId, updatedData) => {
        try {
            const response = await fetch(`/api/players/${playerId}/details`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error('Failed to update player details');
            }
            setPlayer(updatedData);
            return await response.json();
        } catch (error) {
            console.error('Error updating player details:', error);
            throw error;
        }
    };

    const handleStatChange = (statName, newValue) => {
        setPlayer(prevPlayer => ({
            ...prevPlayer,
            stats: {
                ...prevPlayer.stats,
                [statName]: newValue
            }
        }));
        setHasChanges(true);
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
        setHasChanges(true);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedData = {
                ...player,
                Notes: notes
            };
            await updatePlayerDetails(id, updatedData);
            setHasChanges(false);
        } catch (err) {
            setError('Failed to update player details');
        }
    };

    const handleAddItemClick = (index) => {
        setSelectedSlot(index);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (formData) => {
        const updatedInventory = [...player.inventory];
        updatedInventory[selectedSlot] = formData;
        setPlayer(prevPlayer => ({
            ...prevPlayer,
            inventory: updatedInventory
        }));
        setIsModalOpen(false);
        setSelectedSlot(null);
    };

    const handleDeleteItem = (index) => {
        const updatedInventory = [...player.inventory];
        updatedInventory[index] = null;
        setPlayer(prevPlayer => ({
            ...prevPlayer,
            inventory: updatedInventory
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!player) return <div>Player not found</div>;

    const equipment = {
        Armor: 'Leather Armor',
        Weapon: 'Short Sword',
        Accessory: 'Ring of Protection'
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{player.Username}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="player-details-left">
                    {/* Display player inventory */}
                    <h2 className="text-xl font-semibold mb-2">Inventory</h2>
                    <PlayerInventory 
                        inventory={player.inventory} 
                        onAddItemClick={handleAddItemClick}
                        onDeleteItemClick={handleDeleteItem} 
                    />

                    {/* Temporary display of equipped items */}
                    <h2 className="text-xl font-semibold mb-2">Equipped Items</h2>
                    <div className="mb-4">
                        <SimpleDisplay label="Armor" value={equipment.Armor} />
                        <SimpleDisplay label="Weapon" value={equipment.Weapon} />
                        <SimpleDisplay label="Accessory" value={equipment.Accessory} />
                    </div>
                </div>

                <div className="player-details-right">

                    {/* Basic Player Details */}
                    <h2 className="text-xl font-semibold mb-2">Player Stats</h2>
                    <div className="mb-4">
                        <SimpleDisplay label="Level" value={player.Level} />
                        <SimpleDisplay label="Class" value={player.Class} />
                        <SimpleDisplay label="Experience" value={player.Exp} />
                        <SimpleDisplay label="Gold" value={player.Gold} icon="coin" />
                    </div>

                    {/* Player Health and Mana Bars */}
                    <ProgressBar current={player.Health} max={player.MaxHealth} label="HP" color="bg-red-600" />
                    <ProgressBar current={player.Mana} max={player.MaxMana} label="MP" color="bg-blue-600" />

                    {/* Player Stats */}
                    <h3 className="font-semibold mt-4 mb-2">Base Stats</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <StatDisplay label="STR" value={player.stats.STR} onChange={(_, v) => handleStatChange('STR', v)} tooltip="Strength: Affects physical damage and carrying capacity" />
                        <StatDisplay label="DEX" value={player.stats.DEX} onChange={(_, v) => handleStatChange('DEX', v)} tooltip="Dexterity: Affects accuracy and evasion" />
                        <StatDisplay label="AGI" value={player.stats.AGI} onChange={(_, v) => handleStatChange('AGI', v)} tooltip="Agility: Affects speed and initiative" />
                        <StatDisplay label="INT" value={player.stats.INT} onChange={(_, v) => handleStatChange('INT', v)} tooltip="Intelligence: Affects magical power and mana pool" />
                        <StatDisplay label="VIT" value={player.stats.VIT} onChange={(_, v) => handleStatChange('VIT', v)} tooltip="Vitality: Affects health points and physical defense" />
                        <StatDisplay label="WIS" value={player.stats.WIS} onChange={(_, v) => handleStatChange('WIS', v)} tooltip="Wisdom: Affects mana regeneration and magical defense" />
                    </div>

                    {/* Calculated Stats */}
                    <h3 className="font-semibold mb-2">Calculated Stats</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <SimpleDisplay label="Attack" value={player.stats.Attack || 0} />
                        <SimpleDisplay label="Defense" value={player.stats.Defense || 0} />
                        <SimpleDisplay label="Evasion" value={`${player.stats.Evasion || 0}%`} />
                        <SimpleDisplay label="Accuracy" value={`${player.stats.Accuracy || 0}%`} />
                    </div>

                    {/* Player Notes */}
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        rows="4"
                        value={notes}
                        onChange={handleNotesChange}
                        placeholder="Enter player notes, backstory, status ailments, relationships, etc."
                    />
                    <Button onClick={handleSaveChanges} variant="primary" disabled={!hasChanges}> Save Changes </Button>

                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                            &times;
                        </button>
                        <InventoryForm
                            inventory={selectedSlot !== null ? player.inventory[selectedSlot] : null}
                            onSubmit={handleFormSubmit}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setSelectedSlot(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerDetails;