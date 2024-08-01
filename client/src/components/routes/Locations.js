import React, { useState } from 'react';
import EntityMainContent from '../EntityMainContent';

const Locations = () => {
    const [locations, setLocations] = useState([]);

    const handleCreateLocation = (newLocation) => {
        setLocations([...locations, { ...newLocation }]);
    };

    const fields = {
        'Location ID': null,
        'Location Name': null,
        'Description': null,
        'Parent Location ID': null,
    };

    return (
        <div>
            <EntityMainContent 
                entity="Location" 
                fields={fields} 
                entities={locations} 
                onCreateEntity={handleCreateLocation} 
            />
        </div>
    );
};

export default Locations;
