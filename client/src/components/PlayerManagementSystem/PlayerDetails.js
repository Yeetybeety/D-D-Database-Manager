import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import Button from '../generic/DefaultButton';
import ProgressBar from './PlayerProgressBar';
import PlayerInventory from './Inventory';
import SimpleDisplay from '../generic/SimpleDisplay';
import StatDisplay from '../generic/StatDisplay';
import InventoryForm from './InventoryForm';
import EquipmentPanel from './EquipmentPanel'
import EquipmentSlot from './EquipmentSlot';
import InventoryCountButton from './InventoryCountButton';

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
            throw new Error('Failed to fetch player inventory');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching player inventory:', error);
        throw error;
    }
};

// Updates player details on the server
const updatePlayerDetails = async (playerId, Player, Notes, EquippedItems) => {
    try {
        const response = await fetch(`/api/players/${playerId}/details`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...Player,
                Notes: Notes,
                ...EquippedItems,
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to update player details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating player details:', error);
        throw error;
    }
};

// PlayerDetails component
const PlayerDetails = () => {
    // player w/ stats
    const [player, setPlayer] = useState(null);
    // player notes
    const [notes, setNotes] = useState('');
    // player inventory
    const [inventory, setInventory] = useState(new Array(20).fill(null));
    // equipped items; weapon, armour, consumable
    const [equippedItems, setEquippedItems] = useState({
        weapon: null,
        armour: null,
        consumable: null,
    });
    const [calculatedStats, setCalculatedStats] = useState({
        Attack: 0,
        Defense: 0,
        Accuracy: 0,
        Evasion: 0,
        // 0 means the player is dead
        MaxHealth: 10,
        MaxMana: 10,
    });

    const [error, setError] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

    // Calculate stats based on playerStat and equippedItems
    const calculateStats = useCallback((playerData, equippedItemsData) => {
        const baseStats = playerData.stats;

        console.log('Calculating stats...'); // debug
        console.log(baseStats.STR); // debug

        return {
            Attack: ((baseStats.STR ?? 0) * 2) + (baseStats.DEX ?? 0) + (baseStats.AGI ?? 0) + (equippedItemsData.weapon?.Attack ?? 0),
            Defense: ((baseStats.VIT ?? 0) * 2) + (baseStats.WIS ?? 0) + (equippedItemsData.weapon?.Defense ?? 0),
            Accuracy: Math.min((((baseStats.DEX ?? 0) * 2 + (baseStats.INT ?? 0) * 1.5) / 8) + 50, 100),
            Evasion: Math.min((((baseStats.AGI ?? 0) * 2 + (baseStats.DEX ?? 0) * 1.5) / 8) + 50, 100),
            MaxHealth: (baseStats.VIT ?? 0) * 5 || 10,
            MaxMana: (baseStats.INT ?? 0) * 3 || 10,
        };
    }, []);

    const fetchItemDetails = async (itemId) => {
        try {
            const response = await fetch(`/api/items/${itemId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch item details');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching item details:', error);
            return null;
        }
    };

    // run this upon initial rendering of the component
    useEffect(() => {
        const loadPlayerDetails = async () => {
            try {
                // make fetch requests to backend
                const data = await fetchPlayerDetails(id);
                const playerInventory = await fetchPlayerInventory(id);

                console.log(data.WeaponID);
                console.log(data.ArmourID);
                console.log(data.ConsumableID);

                const equippedWeapon = data.WeaponID ? await fetchItemDetails(data.WeaponID) : null;
                const equippedArmour = data.ArmourID ? await fetchItemDetails(data.ArmourID) : null;
                const equippedConsumable = data.ConsumableID ? await fetchItemDetails(data.ConsumableID) : null;

                const equippedItemsData = {
                    weapon: equippedWeapon,
                    armour: equippedArmour,
                    consumable: equippedConsumable,
                };

                console.log('Player Data:'); // debug
                console.log(data); // debug
                console.log('Player Inventory:'); // debug
                console.log(playerInventory); // debug
                console.log('Equipped Items:'); // debug
                console.log(equippedItemsData); // debug

                // Filter out equipped items from inventory
                const filteredInventory = playerInventory.filter(item =>
                    item.ItemID !== data.WeaponID &&
                    item.ItemID !== data.ArmourID &&
                    item.ItemID !== data.ConsumableID
                );

                // calculate stats
                const calculatedStatsData = calculateStats(data, equippedItemsData);

                // set player state
                setPlayer({
                    ...data,
                    stats: {
                        ...data.stats,
                    },
                });

                // set calculated stats
                setCalculatedStats(calculatedStatsData);

                // set inventory, notes, equipped items, and loading state
                setInventory(filteredInventory);
                setNotes(data.Notes || '');
                setEquippedItems(equippedItemsData);
                setLoading(false);
            } catch (err) {
                setError('Failed to load player details');
                setLoading(false);
            }
        };

        loadPlayerDetails();
    }, []);

    // change changes to player stats, equipped items, and notes
    // trigger a re-render of the component
    const handleSaveChanges = async () => {
        try {
            const EquippedItems = {
                EquippedWeapon: equippedItems.weapon?.ItemID || null,
                EquippedArmour: equippedItems.armour?.ItemID || null,
                EquippedConsumable: equippedItems.consumable?.ItemID || null,
            }

            // debug
            console.log('updated data');
            console.log(EquippedItems);
            console.log(player);
            console.log(notes);

            // make fetch request to backend
            await updatePlayerDetails(id, player, notes, EquippedItems);
            setHasChanges(false);
        } catch (err) {
            setError('Failed to update player details');
        }
    };

    // for debugging purposes
    useEffect(() => {
        console.log('equippedItems changed:', equippedItems);
    }, [equippedItems]);

    useEffect(() => {
        console.log('inventory changed:', inventory);
    }, [inventory]);

    useEffect(() => {
        console.log('calculatedStats changed:', calculatedStats);
    }, [calculatedStats]);

    // equip item to player; only affect UI
    const handleEquipItem = async (slotType, item) => {
        const newEquippedItems = { ...equippedItems, [slotType]: item };

        // set equipped items and remove item from inventory
        setEquippedItems(newEquippedItems);
        setInventory(prev => prev.filter(invItem => invItem?.ItemID !== item.ItemID));

        // update player stats
        const calculatedStatsData = calculateStats(player, newEquippedItems);
        setCalculatedStats(calculatedStatsData);
    };

    // unequip item from player; only affect UI
    const handleUnequipItem = async (slotType, item) => {
        const newEquippedItems = { ...equippedItems, [slotType]: null };
        // remove from equippeditems and add to inventory
        setEquippedItems(newEquippedItems);
        setInventory(prev => [...prev, item]);

        // recalculate player stats
        const calculatedStatsData = calculateStats(player, newEquippedItems);
        setCalculatedStats(calculatedStatsData);

    };

    // moves inventory item
    const moveInventoryItem = (dragIndex, hoverIndex) => {
        const dragItem = inventory[dragIndex];
        setInventory(prevInventory => {
            const newInventory = [...prevInventory];
            newInventory.splice(dragIndex, 1);
            newInventory.splice(hoverIndex, 0, dragItem);
            return newInventory;
        });
    };

    // add item to inventory
    const handleAddItem = (slotIndex) => {
        // indicate which inventory slot to add to, open add item modal
        setSelectedItem(null);
        setSelectedSlot(slotIndex);
        setIsModalOpen(true);
    };

    // edit item in inventory
    const handleEditItem = async (item) => {
        // select item to edit, open edit item modal
        setSelectedItem(item);
        setSelectedSlot(null);
        setIsModalOpen(true);
    };

    // handle form submission for adding or updating item
    const handleFormSubmit = async (formData) => {
        try {
            // if no items selected, add new item to inventory, else edit selected item
            const url = selectedItem
                ? `/api/players/${id}/inventory/${selectedItem.ItemID}`
                : `/api/players/${id}/inventory`;
            const method = selectedItem ? 'PUT' : 'POST';

            // make fetch request to backend
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, PlayerID: id, SlotIndex: selectedSlot }),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${selectedItem ? 'update' : 'add'} item`);
            }

            // get updated inventory and set it as new state
            const updatedInventory = await fetchPlayerInventory(id);
            setInventory(updatedInventory);
            setIsModalOpen(false);
            setSelectedItem(null);
            setSelectedSlot(null);
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    // clicking (x) opens delete confirmation modal
    const handleDeleteItemClick = (item) => {
        console.log(selectedItem);
        setDeleteConfirmationModal(true);
        setSelectedItem(item);
        console.log(selectedItem);
    }

    // delete item from inventory
    const handleDeleteItem = async () => {
        console.log(`Selected Item ID: ${selectedItem.ItemID}`);
        try {
            // delete item from inventory on backend
            await fetch(`/api/players/${id}/inventory/${selectedItem.ItemID}`, {
                method: 'DELETE',
            });
            // update inventory state
            const updatedInventory = await fetchPlayerInventory(id);
            setInventory(updatedInventory);
        } catch (error) {
            console.error('Error deleting item from inventory:', error);
        } finally {
            // close the delete confirmation modal and unselect the item
            setDeleteConfirmationModal(false);
            setSelectedItem(null);
        }
    };

    // when we input a new value for a stat
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

    // changes value of notes textarea
    const handleNotesChange = (e) => {
        setNotes(e.target.value);
        setHasChanges(true);
    };

    // loading and error messages
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!player) return <div>Player not found</div>;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">{player.Username}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="player-details-left">

                        {/* <EquipmentPanel
                            equippedItems={equippedItems}
                            onEquip={handleEquipItem}
                            onUnequip={handleUnequipItem}
                        /> */}

                        <div className="equipment-panel">
                            <h2 className="text-xl font-semibold mb-2">Equipment</h2>
                            <div className="flex space-x-4 mb-4">
                                <EquipmentSlot type="weapon" item={equippedItems.weapon} onEquip={handleEquipItem} onUnequip={handleUnequipItem} />
                                <EquipmentSlot type="armour" item={equippedItems.armour} onEquip={handleEquipItem} onUnequip={handleUnequipItem} />
                                <EquipmentSlot type="consumable" item={equippedItems.consumable} onEquip={handleEquipItem} onUnequip={handleUnequipItem} />
                            </div>
                        </div>

                        {/* Display player inventory */}
                        <PlayerInventory
                            inventory={inventory}
                            onAddItem={handleAddItem}
                            onEditItem={handleEditItem}
                            onDeleteItem={handleDeleteItemClick}
                            moveItem={moveInventoryItem}
                        />

                        {/* Display a count of player's inventory */}
                        <div className="mb-4">
                            <InventoryCountButton playerId={id} />
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
                            <SimpleDisplay label="Attack" value={calculatedStats.Attack || 0} />
                            <SimpleDisplay label="Defense" value={calculatedStats.Defense || 0} />
                            <SimpleDisplay label="Evasion" value={`${calculatedStats.Evasion || 0}%`} />
                            <SimpleDisplay label="Accuracy" value={`${calculatedStats.Accuracy || 0}%`} />
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

                {/* Inventory form */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                            <InventoryForm
                                selectedItem={selectedItem}
                                onSubmit={handleFormSubmit}
                                onCancel={() => {
                                    setIsModalOpen(false);
                                    setSelectedSlot(null);
                                    setSelectedItem(null);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Delete Confirmation for Inventory Item */}
                {deleteConfirmationModal && (
                    <div id="popup-modal" tabIndex="-1" className="fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-50">
                        <div className="relative p-4 w-full max-w-md">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <button onClick={() => setDeleteConfirmationModal(false)} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="p-4 md:p-5 text-center">
                                    <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this player?</h3>
                                    <button onClick={handleDeleteItem} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                        Yes, I'm sure
                                    </button>
                                    <button onClick={() => setDeleteConfirmationModal(false)} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                        No, cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DndProvider>
    );
};

export default PlayerDetails;