import React, { useState } from 'react';

const FilterComponent = ({ results, setResults, fetchNPC }) => {
    const [filters, setFilters] = useState([{ field: '', operator: '=', value: '' }]);
    const [selectedAttributes, setSelectedAttributes] = useState({
        NPCName: false,
        Description: false,
        Race: false,
        Level: false,
        Health: false,
        AIBehaviour: false,
        LocationID: false,
    });

    const handleAddFilter = () => {
        setFilters([...filters, { field: '', operator: '=', value: '' }]);
    };

    const handleRemoveFilter = (index) => {
        const newFilters = filters.filter((_, i) => i !== index);
        setFilters(newFilters);
    };

    const handleFilterChange = (index, key, value) => {
        const newFilters = filters.map((filter, i) =>
            i === index ? { ...filter, [key]: value } : filter
        );
        setFilters(newFilters);
    };

    const handleAttributeChange = (attribute) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [attribute]: !prev[attribute],
        }));
    };

    const handleSubmit = async () => {
        const filterStrings = filters
            .filter(filter => filter.field && filter.value !== '')
            .map(filter => `${filter.field} ${filter.operator} '${filter.value}'`)
            .join(' AND ');

        const selectedFields = Object.keys(selectedAttributes)
            .filter(attr => selectedAttributes[attr])
            .join(', ');

        const response = await fetch(`/api/npc?filter=${encodeURIComponent(filterStrings)}&fields=${encodeURIComponent(selectedFields)}`);
        const data = await response.json();
        setResults(data);
    };

    const handleReset = () => {
        setFilters([{ field: '', operator: '=', value: '' }]);
        fetchNPC();
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filter NPCs</h2>
            <div className="mb-4 flex">
                <h3 className="text-lg font-semibold mx-2">Select Attributes to View:</h3>
                {Object.keys(selectedAttributes).map(attribute => (
                    <div key={attribute} className="mx-3">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedAttributes[attribute]}
                                onChange={() => handleAttributeChange(attribute)}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{attribute}</span>
                        </label>
                    </div>
                ))}
            </div>
            {filters.map((filter, index) => (
                <div key={index} className="mb-4 flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Field"
                        value={filter.field}
                        onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                        className="border p-2 rounded-lg"
                    />
                    <select
                        value={filter.operator}
                        onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                        className="border p-2 rounded-lg"
                    >
                        <option value="=">=</option>
                        <option value=">">{'>'}</option>
                        <option value="<">{'<'}</option>
                        <option value=">=">=</option>
                        <option value="<=">{'<='}</option>
                        <option value="<>">{'<>'}</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Value"
                        value={filter.value}
                        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                        className="border p-2 rounded-lg"
                    />
                    <button
                        onClick={() => handleRemoveFilter(index)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                onClick={handleAddFilter}
                className="bg-blue-500 text-white p-2 rounded-lg m-2 hover:bg-blue-600"
            >
                Add Filter
            </button>
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded-lg m-2 hover:bg-blue-600"
            >
                Filter
            </button>
            <button
                onClick={handleReset}
                className="bg-gray-500 text-white p-2 rounded-lg m-2 hover:bg-gray-600"
            >
                Reset Filters
            </button>
            {/* <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">Results:</h3>
                <ul>
                    {results.length > 0 ? (
                        results.map((npc, index) => (
                            <li key={index} className="border-b py-2">{JSON.stringify(npc)}</li>
                        ))
                    ) : (
                        <div>No Results Found.</div>
                    )}
                </ul>
            </div> */}
        </div>
    );
};

export default FilterComponent;
