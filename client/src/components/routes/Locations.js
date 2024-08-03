import React from 'react';
import EntityMainContent from '../EntityMainContent';

const Locations = ({ entities, createLocation, deleteLocation, editLocation }) => {

    const locations = entities

    const handleCreateLocation = (newLocation) => {
        createLocation('location', newLocation);
    };

    const handleEditLocation = (updatedLocation) => {
        editLocation('location', updatedLocation);
    };

    const handleDeleteLocation = (locationId) => {
        console.log(locationId);
        deleteLocation('location', locationId);
    };

    // Pass in fields so the 'Create' component knows which input fields to render
    const fields = {
        'LocationID': null,
        'LocationName': null,
        'Description': null,
        'ParentLocationID': null,
    };

    return (
        <div>
            <EntityMainContent 
                entity="Location" 
                fields={fields} 
                entities={locations} 
                onCreateEntity={handleCreateLocation} 
                onDeleteEntity={handleDeleteLocation} 
                onEditEntity={handleEditLocation} 
            />
        </div>
    );
};

export default Locations;
