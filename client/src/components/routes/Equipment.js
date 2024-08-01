import React, { useState } from 'react';
import EntityMainContent from '../EntityMainContent';

const Equipment = () => {
    const [equipments, setEquipments] = useState([]);

    const handleCreateEquipment = (newEquipment) => {
        setEquipments([...equipments, { ...newEquipment }]);
    };

    const fields = {
        'Item Name': null,
        'Item ID': null,
        'Durability': null,
    };

    return (
        <div>
            <EntityMainContent 
                entity="Equipment" 
                fields={fields} 
                entities={equipments} 
                onCreateEntity={handleCreateEquipment} 
            />
        </div>
    );
};

export default Equipment;
