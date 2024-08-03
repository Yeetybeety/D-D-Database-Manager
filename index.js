const express = require('express');
const mysql = require('mysql2/promise'); // Use the promise-based version
const app = express();
const port = 3001;

require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;

// MySQL connection setup
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(express.json()); // Add this line to parse JSON request bodies

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});


// Get Players
app.get('/api/players', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Player');
    res.json(rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to fetch players.' });
  }
});

// Delete Player
app.delete('/api/players/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Player WHERE PlayerID = ?', [id]);
    console.log(`Player with ID ${id} deleted from the database.`);
    // send a response with status code 204 (No Content)
    res.status(204).end();
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to delete the player.' });
  }
});

// Add Player
app.post('/api/players', async (req, res) => {

  console.log('Received Request:', req.body);

  // set the default location to 'Tavern' if not provided
  // TODO set the campaignID when campaign is figured out

  // parse the args
  const { Username, ClassType, Level, Exp, Health, MaxHealth, Mana, MaxMana, Gold } = req.body;

  // server-side form validation
  if (!Username || !ClassType || !Level || !Exp || !Health || !MaxHealth || !Mana || !MaxMana || !Gold) {
    return res.status(400).json({ error: 'Invalid request: player data is required.' });
  } 

  // try to insert the new player into the database
  // TODO (optional): set default values for level, gold, exp, etc.
  try {
    await pool.query('START TRANSACTION');

    // TODO: bring back class template (org. Player1)

    // Insert the player into the Player table
    const playerQuery = 'INSERT INTO Player (Username, Class, Level, Exp, Health, MaxHealth, Mana, MaxMana, Gold, CampaignID, LocationID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [insertResult] = await pool.query(playerQuery, [Username, ClassType, Level, Exp, Health, MaxHealth, Mana, MaxMana, Gold, 1, 1]);
    const newPlayerID = insertResult.insertId;

    // Commit the transaction
    await pool.query('COMMIT');

    // Fetch the newly inserted player to display
    // Note: idk it seem more straightforward than tinkering w/ react :3
    const fetchPlayerQuery = 'SELECT * FROM Player WHERE PlayerID = ?';
    const [playerResult] = await pool.query(fetchPlayerQuery, [newPlayerID]);
    const newPlayer = playerResult[0];

    // Note: a lot of default values
    console.log("Player added to database:", newPlayer);

    // send a response with the newly inserted player
    res.status(201).json(newPlayer);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to add the player.' });
  }

});

// Edit Player
app.put('/api/players/:id', async (req, res) => {
  console.log('Received Edit Request:', req.body);

  const playerId = req.params.id;
  const { Username, ClassType, Level, MaxHealth, MaxMana, Gold, Exp, Health, Mana } = req.body;

  // Server-side form validation
  if (!Username || !ClassType || !Level || !Exp || !Health || !MaxHealth || !Mana || !MaxMana || !Gold) {
    return res.status(400).json({ error: 'Invalid request: player data is incomplete.' });
  }

  try {
    await pool.query('START TRANSACTION');

    // Update the player in the Player table
    const updatePlayerQuery = `
      UPDATE Player 
      SET Username = ?, Class = ?, Level = ?, Exp = ?, Health = ?, MaxHealth = ?, 
          Mana = ?, MaxMana = ?, Gold = ?
      WHERE PlayerID = ?
    `;
    await pool.query(updatePlayerQuery, [
      Username, ClassType, Level, Exp, Health, MaxHealth, 
      Mana, MaxMana, Gold, playerId
    ]);

    // Commit the transaction
    await pool.query('COMMIT');

    // Fetch the updated player to return
    const fetchPlayerQuery = 'SELECT * FROM Player WHERE PlayerID = ?';
    const [playerResult] = await pool.query(fetchPlayerQuery, [playerId]);
    const updatedPlayer = playerResult[0];

    if (!updatedPlayer) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    console.log("Player updated in database:", updatedPlayer);

    // Send a response with the updated player
    res.status(200).json(updatedPlayer);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to update the player.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;