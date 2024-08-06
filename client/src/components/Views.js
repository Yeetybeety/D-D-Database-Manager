import React, { useState, useEffect } from 'react';

const TableSelector = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [attributes, setAttributes] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [data, setData] = useState([]);

    // Fetch the list of tables from the database
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch('/api/tables');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const tables = await response.json()
                console.log(tables);
                console.log('hi');
                setTables(tables);
            } catch (error) {
                console.error('Failed to fetch tables:', error);
            }
        };

        fetchTables();
    }, []);

    // Fetch attributes for the selected table
    useEffect(() => {
        if (selectedTable) {
            const fetchAttributes = async (table) => {
                try {
                    const response = await fetch(`/api/columns/${table}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log(data)
                    setSelectedAttributes([]);
                    setAttributes(data);
                } catch (error) {
                    console.log(error.message);
                }
            };
            console.log('fetching attributes...')
            fetchAttributes(selectedTable);

        }
    }, [selectedTable]);

    // Handle table selection change
    const handleTableChange = (event) => {
        setSelectedTable(event.target.value);
    };

    // Handle attribute checkbox change
    const handleCheckboxChange = (attribute) => {
        setSelectedAttributes(prevSelected =>
            prevSelected.includes(attribute)
                ? prevSelected.filter(attr => attr !== attribute)
                : [...prevSelected, attribute]
        );
    };

    // Fetch data based on selected attributes
    const handleProject = async () => {
        try {
            const query = selectedAttributes.join(',');
            const response = await fetch(`/api/project/${selectedTable}?attributes=${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <label htmlFor="table-select" className="block text-lg font-bold mb-2">Select Table:</label>
                    <select
                        id="table-select"
                        value={selectedTable}
                        onChange={handleTableChange}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                    >
                        <option value="">--Select a Table--</option>
                        {tables?.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                </div>

                {attributes?.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-4">Select Attributes to Project:</h2>
                        <div className="flex flex-wrap gap-4">
                            {attributes?.map(attr => (
                                <label key={attr} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedAttributes.includes(attr)}
                                        onChange={() => handleCheckboxChange(attr)}
                                        className="form-checkbox"
                                    />
                                    {attr}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleProject}
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    Project
                </button>

                {data.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-bold mb-4">Projected Data:</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {selectedAttributes?.map(attr => (
                                        <th key={attr} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {attr}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data?.map((row, index) => (
                                    <tr key={index}>
                                        {selectedAttributes?.map(attr => (
                                            <td key={attr} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {row[attr] || 'N/A'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

    );
};

export default TableSelector;
