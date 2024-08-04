const express = require('express');
const mysql = require('mysql2/promise'); // Use the promise-based version
const app = express();
//const cors = require('cors');
const port = 3001;
require('dotenv').config();

//app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // This line is crucial for parsing JSON request bodies

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

// Add Player
app.post('/api/players', async (req, res) => {
  console.log('Received Request:', req.body);

  const { Username, ClassType, Level, Exp, Health, MaxHealth, Mana, MaxMana, Gold } = req.body;

  if (!Username || !ClassType || !Level || !Exp || !Health || !MaxHealth || !Mana || !MaxMana || !Gold) {
    return res.status(400).json({ error: 'Invalid request: player data is required.' });
  } 

  try {
    const connection = await pool.getConnection();
    await connection.query('START TRANSACTION');

    const playerQuery = 'INSERT INTO Player (Username, Class, Level, Exp, Health, MaxHealth, Mana, MaxMana, Gold, CampaignID, LocationID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [insertResult] = await connection.query(playerQuery, [Username, ClassType, Level, Exp, Health, MaxHealth, Mana, MaxMana, Gold, 1, 1]);
    const newPlayerID = insertResult.insertId;

    await connection.query('COMMIT');

    const fetchPlayerQuery = 'SELECT * FROM Player WHERE PlayerID = ?';
    const [playerResult] = await connection.query(fetchPlayerQuery, [newPlayerID]);
    const newPlayer = playerResult[0];

    console.log("Player added to database:", newPlayer);

    res.status(201).json(newPlayer);
    connection.release();
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to add the player.' });
  }
});

// Delete Player
app.delete('/api/players/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Player WHERE PlayerID = ?', [id]);
    console.log(`Player with ID ${id} deleted from the database.`);
    res.status(204).end();
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to delete the player.' });
  }
});

// Edit Player
app.put('/api/players/:id', async (req, res) => {
  console.log('Received Edit Request:', req.body);

  const playerId = req.params.id;
  const { Username, ClassType, Level, MaxHealth, MaxMana, Gold, Exp, Health, Mana } = req.body;

  if (!Username || !ClassType || !Level || !Exp || !Health || !MaxHealth || !Mana || !MaxMana || !Gold) {
    return res.status(400).json({ error: 'Invalid request: player data is incomplete.' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query('START TRANSACTION');

    const updatePlayerQuery = `
      UPDATE Player 
      SET Username = ?, Class = ?, Level = ?, Exp = ?, Health = ?, MaxHealth = ?, 
          Mana = ?, MaxMana = ?, Gold = ?
      WHERE PlayerID = ?
    `;
    await connection.query(updatePlayerQuery, [
      Username, ClassType, Level, Exp, Health, MaxHealth, 
      Mana, MaxMana, Gold, playerId
    ]);

    await connection.query('COMMIT');

    const fetchPlayerQuery = 'SELECT * FROM Player WHERE PlayerID = ?';
    const [playerResult] = await connection.query(fetchPlayerQuery, [playerId]);
    const updatedPlayer = playerResult[0];

    if (!updatedPlayer) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    console.log("Player updated in database:", updatedPlayer);

    res.status(200).json(updatedPlayer);
    connection.release();
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to update the player.' });
  }
});

app.put('/api/players/:id/details', async (req, res) => {
 
  console.log('Received Edit Request:', req.body);
 
  const playerId = req.params.id;
  const { Notes, stats } = req.body;


  try {
    await pool.query('START TRANSACTION');


    // Update notes
    if (Notes !== undefined) {
      const notesQuery = 'UPDATE Player SET Notes = ? WHERE PlayerID = ?';
      await pool.query(notesQuery, [Notes, playerId]);
    }


    // Update stats
    if (stats && Object.keys(stats).length > 0) {
      const updatePromises = Object.entries(stats).map(async ([statName, statValue]) => {
        const updateStatQuery = `
          INSERT INTO PlayerStat (PlayerID, StatName, StatValue)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE StatValue = ?
        `;
        await pool.query(updateStatQuery, [playerId, statName, statValue, statValue]);
      });


      await Promise.all(updatePromises);
    }


    await pool.query('COMMIT');
    console.log(`Player details updated successfully for player ${playerId}`);
    res.json({ message: 'Player details updated successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating player details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get player details
app.get('/api/players/:id', async (req, res) => {
  const playerId = req.params.id;
  try {
    const [playerRows] = await pool.query('SELECT * FROM Player WHERE PlayerID = ?', [playerId]);

    if (playerRows.length === 0) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const player = playerRows[0];

    const [statsRows] = await pool.query('SELECT StatName, StatValue FROM PlayerStat WHERE PlayerID = ?', [playerId]);

    player.stats = {};
    statsRows.forEach(stat => {
      player.stats[stat.StatName] = stat.StatValue;
    });

    console.log('Player details:', player);

    res.json(player);
  } catch (error) {
    console.error('Error fetching player details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create an Entity
const createEntity = async (tableName, req, res) => {
  const { ...data } = req.body;
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data);
  const placeholders = values.map(() => '?').join(', ');

  const table = capitalizeFirstLetter(tableName);
  console.log("Inserting into table: ", table);

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  try {
    const [result] = await pool.query(query, values);
    res.json({ ...data, ID: result.insertId });
  } catch (err) {
    console.error(`Error inserting into ${table}:`, err);
    res.status(500).send(`Error inserting into ${table}`);
  }
};

function capitalizeFirstLetter(str) {
  return str.replace(/^\w/, c => c.toUpperCase());
}

// Edit specific Entity from table
const updateEntity = async (tableName, req, res) => {
  const id = req.params.id;
  const { ...data } = req.body;
  const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const [firstValue] = Object.values(data);
  const values = [...Object.values(data), firstValue];

  const table = capitalizeFirstLetter(tableName);
  const columnName = `${table}ID`;

  const query = `UPDATE ${table} SET ${columns} WHERE ${columnName} = ?`;
  try {
    const [result] = await pool.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send(`${table} not found`);
    }
    res.json(data);
  } catch (err) {
    console.error(`Error updating ${table}:`, err);
    res.status(500).send(`Error updating ${table}`);
  }
};

// Delete specific Entity from Table
const deleteEntity = async (tableName, req, res) => {
  const id = req.params.id;
  console.log(id);
  const table = capitalizeFirstLetter(tableName);
  const columnName = `${table}ID`;

  const query = `DELETE FROM ${table} WHERE ${columnName} = ?`;
  try {
    const [result] = await pool.query(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send(`${table} not found`);
    }
    res.sendStatus(204);
    console.log("Successful Deletion");
  } catch (err) {
    console.error(`Error deleting from ${table}:`, err);
    res.status(500).send(`Error deleting from ${table}`);
  }
};

// Get all entities relating to that Table
const getEntities = async (tableName, req, res) => {
  const table = capitalizeFirstLetter(tableName);
  try {
    const [results] = await pool.query(`SELECT * FROM ${table}`);
    res.json(results);
  } catch (err) {
    console.error(`Error fetching from ${table}:`, err);
    res.status(500).send(`Error fetching from ${table}`);
  }
};

app.post('/api/:entity', (req, res) => {
  createEntity(req.params.entity, req, res);
});

app.put('/api/:entity/:id', (req, res) => {
  updateEntity(req.params.entity, req, res);
});

app.delete('/api/:entity/:id', (req, res) => {
  deleteEntity(req.params.entity, req, res);
});

app.get('/api/:entity', (req, res) => {
  getEntities(req.params.entity, req, res);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
