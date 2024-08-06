import React, { useState, useEffect } from 'react';

const EntityEdit = ({ name, fields, onEditEntity, onClose, entityData }) => {
  // Initialize form state based on entityData prop
  const [formState, setFormState] = useState(
    Object.keys(fields).reduce((acc, key) => {
      acc[key] = entityData[key] || ''; // Use entityData values or default to empty string
      return acc;
    }, {})
  );

  // Update formState when entityData changes
  useEffect(() => {
    setFormState(
      Object.keys(fields).reduce((acc, key) => {
        acc[key] = entityData[key] || ''; // Use entityData values or default to empty string
        return acc;
      }, {})
    );
  }, [entityData, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Set to null if empty for optional fields
    const newValue = value === '' ? null : value;
    setFormState({
      ...formState,
      [name]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare form data for submission
    const sanitizedFormState = Object.keys(formState).reduce((acc, key) => {
      // Ensure empty strings are converted to null for number fields
      acc[key] = formState[key] === '' ? null : formState[key];
      return acc;
    }, {});

    console.log('Form Data to Submit:', sanitizedFormState); // Debugging: Check what is being submitted

    onEditEntity(sanitizedFormState);
    onClose();  // Close the modal after creating the entity
  };

  return (
    <div className='max-h-[600px] overflow-y-auto'>
      <h2 className="text-2xl font-bold mb-4">Edit {name}</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(fields).map(([label, options], index) => {
          const idName = `${name}ID`;
          console.log(idName);
          if (label === idName) {
            // Render Title as a non-editable field
            return (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>{label}</label>
                <p className="text-gray-700">{formState[label]}</p>
              </div>
            );
          } else if (Array.isArray(options)) {
            // Render a select menu if options are provided
            return (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>{label}</label>
                <select
                  id={label}
                  name={label}
                  value={formState[label]}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select {label}</option>
                  {options.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            );
          } else {
            // Render a text input if no options are provided
            return (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>{label}</label>
                <input
                  type="text"
                  id={label}
                  name={label}
                  value={formState[label]}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            );
          }
        })}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Changes to {name}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntityEdit;
