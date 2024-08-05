// src/components/MainContent.js
import React, { useState, useEffect } from 'react';
// import EntityButton from './EntityButton';
import EntityCreation from './CreateEntity';
import Modal from './Modal';
import EntityDisplay from './EntityDisplay';

const EntityMainContent = ({ entity, entities, setEntities, onCreateEntity, fields, onDeleteEntity, onEditEntity, fetchAttributes }) => {
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchInitialAttributes = async () => {
            try {
                const fetchedAttributes = await fetchAttributes(entity);
                setAttributes(fetchedAttributes);
            } catch (error) {
                console.error('Failed to fetch attributes:', error);
            }
        };

        fetchInitialAttributes();
    }, [fetchAttributes, entity]);

    const handleCreateEntity = (newEntity) => {
        onCreateEntity(newEntity)
        setShowModal(false);
    };

    const handleEditEntity = (newEntity) => {
        onEditEntity(newEntity);
        setShowModal(false);
    };

    const handleCheckboxChange = (attribute) => {
        setSelectedAttributes(prevSelected => 
            prevSelected.includes(attribute)
                ? prevSelected.filter(attr => attr !== attribute)
                : [...prevSelected, attribute]
        );
    };

    const handleSelect = async () => {
        try {
            const query = selectedAttributes.join(',');
            const tableName = lowerFirstLetter(entity);
            const response = await fetch(`/api/project/${tableName}?attributes=${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEntities(data)
        } catch (error) {
            console.error('Failed to fetch quests:', error);
        }
    };  


    function lowerFirstLetter(str) {
        return str.replace(/^\w/, c => c.toLowerCase());
      }

    return (
        <main className="flex-grow p-4">
            {entity != 'NPC2' ?
            <div className="p-4 bg-gray-100 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-bold mb-2">Select Attributes</h2>
                <div className="flex flex-wrap mb-4">
                    {attributes.map(attr => (
                        <label key={attr} className="mr-4">
                            <input
                                type="checkbox"
                                checked={selectedAttributes.includes(attr)}
                                onChange={() => handleCheckboxChange(attr)}
                            />
                            {attr}
                        </label>
                    ))}
                </div>
                <button
                    onClick={handleSelect}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    Select
                </button>
            </div>
            :
            <div></div>}
            <div className="container mx-auto">
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-4">
                    <h2 className="text-xl font-bold mb-4">Manage {entity}</h2>
                    {/* This code below displays the created entities so you can view them */}
                    <div className="grid grid-cols-3 gap-4">
                        {entities.length > 0 ? (
                            entities.map((entityData, index) => (
                                <div key={index} className="mb-4">
                                    <EntityDisplay entity={entity} entityData={entityData} onEdit={handleEditEntity} fields={fields} onDelete={onDeleteEntity} />
                                </div>
                            ))
                        ) : (
                            <p>No {entity.toLowerCase()} available</p>
                        )}
                    </div>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 mb-4"
                        onClick={() => setShowModal(true)}>
                        Create {entity}
                    </button>
                </div>
                <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                    <EntityCreation name={entity} fields={fields} onCreateEntity={handleCreateEntity} onClose={() => setShowModal(false)} />
                </Modal>
                {/* This code below renders the buttons for you to manage each entity you have created */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {entities?.map((entityObject, index) => (
                        <EntityButton route={entity} key={index} entityNumber={index + 1} name={entityObject.Title} />
                    ))}
                </div> */}
            </div>
        </main>
    );
};

export default EntityMainContent;
