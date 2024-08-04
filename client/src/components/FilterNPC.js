import React, { useState } from 'react';

const NpcFilter = () => {
  const [columnName, setColumnName] = useState('');
  const [operator, setOperator] = useState('='); // Default operator
  const [value, setValue] = useState('');

  const handleFilter = async () => {
    try {
      // Build the filter string and encode it for the URL
      const filterString = `${columnName} ${operator} '${value}'`;
      const encodedFilter = encodeURIComponent(filterString);

      const response = await fetch(`/api/npc?filter=${encodedFilter}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Filtered NPCs:', data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching NPCs:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
        placeholder="Column Name"
      />
      <select
        value={operator}
        onChange={(e) => setOperator(e.target.value)}
      >
        <option value="=">=</option>
        <option value=">">{'>'}</option>
        <option value="<"> {'<'} </option>
        <option value=">=">=</option>
        <option value="<=">{'<='}</option>
        <option value="<>">{'<>'}</option>
      </select>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
      />
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default NpcFilter;
