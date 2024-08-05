import React from 'react';
import EntityMainContent from '../EntityMainContent';

const EventLogs = ({ entities, createEventLog, deleteEventLog, editEventLog }) => {
    const eventLogs = entities;

    const handleCreateEventLog = (newEventLog) => {
        createEventLog('eventLog', newEventLog);
    };

    const handleEditEventLog = (updatedEventLog) => {
        editEventLog('eventLog', updatedEventLog);
    };

    const handleDeleteEventLog = (eventLogId) => {
        deleteEventLog('eventLog', eventLogId);
    };

    // Pass in fields so the 'Create' component knows which input fields to render
    const fields = {
        'EventLogID': null,
        'Description': null,
        'PlayerAction': null,
        'CampaignID': null,
    };

    return (
        <div>
            <EntityMainContent 
                entity="EventLog" 
                fields={fields} 
                entities={eventLogs} 
                onCreateEntity={handleCreateEventLog} 
                onDeleteEntity={handleDeleteEventLog} 
                onEditEntity={handleEditEventLog} 
            />
        </div>
    );
};

export default EventLogs;
