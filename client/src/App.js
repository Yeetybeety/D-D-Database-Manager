import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('/api/players')
      .then(response => response.json())
      .then(data => setPlayers(data));
  }, []);

  return (
    <div className="App">
      <h1>Players</h1>
      <ul>
        {players.map(player => (
          <li>{player.Username}: {player.Class}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
