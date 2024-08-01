import React, { useState } from 'react';
import EntityMainContent from '../EntityMainContent';

const EventLogs = () => {
    const [eventLogs, setEventLogs] = useState([]);

    const handleCreateEventLog = (newEventLog) => {
        setEventLogs([...eventLogs, { ...newEventLog }]);
    };

    const fields = {
        'Event ID': null,
        'Description': null,
        'Player Action': null,
        'Campaign ID': null,
    };

    return (
        <div>
            <EntityMainContent 
                entity="Event Log" 
                fields={fields} 
                entities={eventLogs} 
                onCreateEntity={handleCreateEventLog} 
            />
        </div>
    );
};

export default EventLogs;
