import React, { useState } from 'react';


const EntityCreation = ({ name, fields, onCreateEntity, onClose }) => {
 const [formState, setFormState] = useState(
   Object.keys(fields).reduce((acc, key) => {
     acc[key] = ''; // Initialize all fields with an empty string
     return acc;
   }, {})
 );


 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormState({
     ...formState,
     [name]: value,
   });
 };


 const handleSubmit = (e) => {
   e.preventDefault();
   onCreateEntity(formState);
   onClose();  // Close the modal after creating the entity
 };

 // The way this works is that it expects a 'fields' to be a dictionary
 // Each key represents a label for an input
 // If the value associated with the key is 'null', then it is a text input
 // else, the value will be a list of the selection options
 return (
   <div>
     <h2 className="text-2xl font-bold mb-4">Create {name}</h2>
     <form onSubmit={handleSubmit}>
       {Object.entries(fields).map(([label, options], index) => {
         if (Array.isArray(options)) {
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
           Create {name}
         </button>
       </div>
     </form>
   </div>
 );
};


export default EntityCreation;
