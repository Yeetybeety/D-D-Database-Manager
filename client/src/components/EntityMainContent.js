// src/components/MainContent.js
import React, { useState } from 'react';
// import EntityButton from './EntityButton';
import EntityCreation from './CreateEntity';
import Modal from './Modal';
import EntityDisplay from './EntityDisplay';

const EntityMainContent = ({ entity, entities, onCreateEntity, fields, onDeleteEntity, onEditEntity }) => {
    const [showModal, setShowModal] = useState(false);

    const handleCreateEntity = (newEntity) => {
        onCreateEntity(newEntity)
        setShowModal(false);
    };

    const handleEditEntity = (newEntity) => {
        onEditEntity(newEntity);
        setShowModal(false);
    };

    return (
        <main className="flex-grow p-4">
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
