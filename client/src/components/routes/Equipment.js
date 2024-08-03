import React from 'react';
import EntityMainContent from '../EntityMainContent';

const Equipment = ({ entities, createEquipment, deleteEquipment, editEquipment }) => {
    
    const equipments = entities

    const handleCreateEquipment = (newEquipment) => {
        console.log(newEquipment);
        createEquipment('equipment', newEquipment);
    };

    const handleEditEquipment = (updatedEquipment) => {
        editEquipment('equipment', updatedEquipment);
    };

    const handleDeleteEquipment = (equipmentId) => {
        deleteEquipment('equipment', equipmentId);
    };

    // Pass in fields so the 'Create' component knows which input fields to render
    const fields = {
        'ItemID': null,
        'Durability': null,
    };

    return (
        <div>
            <EntityMainContent 
                entity="Equipment" 
                fields={fields} 
                entities={equipments} 
                onCreateEntity={handleCreateEquipment} 
                onDeleteEntity={handleDeleteEquipment} 
                onEditEntity={handleEditEquipment} 
            />
        </div>
    );
};

export default Equipment;
