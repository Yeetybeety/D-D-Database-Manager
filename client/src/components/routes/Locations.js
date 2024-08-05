import React, { useState } from 'react';
import EntityMainContent from '../EntityMainContent';
import DefaultButton from '../generic/DefaultButton';

const Locations = ({ entities, createLocation, deleteLocation, editLocation }) => {
    const [mostPopulated, setMostPopulated] = useState('');

    const locations = entities

    const handleFindMostPopulated = async () => {
        try {
            const response = await fetch('/api/location/most-populated');
            if (!response.ok) {
                throw new Error('Failed to fetch the the most populated locations');
            }
            const data = await response.json();
            console.log('hi')
            setMostPopulated(data.messageString);
            console.log(mostPopulated)
        } catch (err) {
            console.error('Frontend Error:', err);
            setMostPopulated('An error occurred while fetching the players who collected all items.');
            
        }
    };

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
            <div className="mb-6 ml-[95px] mt-6">
                <DefaultButton onClick={handleFindMostPopulated}>Find Most Populated Location</DefaultButton>
                {mostPopulated && (
                    <div className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                        {mostPopulated}
                    </div>
                )}
            </div>
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
