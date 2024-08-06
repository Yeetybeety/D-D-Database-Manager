const express = require('express');
const mysql = require('mysql2/promise'); // Use the promise-based version
const app = express();
// const cors = require('cors');
const port = 3001;
require('dotenv').config();

const sqlstring = require('sqlstring');

// app.use(cors()); // Enable CORS for all routes
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

// Get all Campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Campaign');
    res.json(rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to fetch campaigns.' });
  }
});

// Add a new Campaign
app.post('/api/campaigns', async (req, res) => {
  const { Title, StartDate, EndDate } = req.body;

  if (!Title || !StartDate || !EndDate) {
    return res.status(400).json({ error: 'Title, StartDate, and EndDate are required' });
  }

  try {
    const [result] = await pool.query('INSERT INTO Campaign (Title, StartDate, EndDate) VALUES (?, ?, ?)', [Title, StartDate, EndDate]);
    const newCampaign = {
      CampaignID: result.insertId,
      Title,
      StartDate,
      EndDate
    };
    res.status(201).json(newCampaign);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to add the campaign.' });
  }
});


// Get a specific Campaign by ID
app.get('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM Campaign WHERE CampaignID = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to fetch the campaign.' });
  }
});

// Delete a Campaign by ID
app.delete('/api/campaigns/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Campaign WHERE CampaignID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Get the maximum CampaignID value
    const [rows] = await pool.query('SELECT MAX(CampaignID) AS maxId FROM Campaign');
    const maxId = rows[0].maxId || 0;

    // Reset AUTO_INCREMENT value
    await pool.query(`ALTER TABLE Campaign AUTO_INCREMENT = ${maxId + 1}`);

    res.status(204).end();
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to delete the campaign.' });
  }
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

// Route to handle NPC filtering
app.get('/api/npc', async (req, res) => {
  try {
    const { filter, fields } = req.query;

    // Basic validation to ensure filter is a string
    if (typeof filter !== 'string') {
      return res.status(400).json({ error: 'Invalid filter parameter' });
    }

    // Construct the query
    let query = `SELECT ${fields} FROM NPC2 WHERE ${filter}`;

    if (fields.length == 0 && filter.length == 0) {
      query = `SELECT * FROM NPC2`;
    } else if (fields.length == 0) {
      query = `SELECT * FROM NPC2 WHERE ${filter}`;
    } else if (filter.length == 0) {
      query = `SELECT ${fields} FROM NPC2`;
    }

    console.log(query);

    // Execute the query
    const [rows] = await pool.query(query);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching NPCs:', err);
    res.status(500).json({ error: 'An error occurred while trying to fetch NPCs.' });
  }
});

// Get number of items in player's inventory for each item type
app.get('/api/players/:id/inventory/count', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT I.ItemType, COUNT(*) as Count FROM Inventory Inv, Item I WHERE Inv.ItemID = I.ItemID AND Inv.PlayerID = ? GROUP BY I.ItemType;', [id]);
    if (rows.length === 0) {
      res.json({ message: 'Inventory is empty' });
    } else {
      res.json({ result: rows });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to count the inventory items.' });
  }
});

// Get Player Inventory
app.get('/api/players/:id/inventory', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT i.*, e.Durability, w.Attack, a.Defense, m.MaterialType, c.EffectType, c.EffectValue, c.Duration
      FROM Inventory inv
      JOIN Item i ON inv.ItemID = i.ItemID
      LEFT JOIN Equipment e ON i.ItemID = e.ItemID
      LEFT JOIN Weapon w ON i.ItemID = w.ItemID
      LEFT JOIN Armour a ON i.ItemID = a.ItemID
      LEFT JOIN Material m ON i.ItemID = m.ItemID
      LEFT JOIN Consumable c ON i.ItemID = c.ItemID
      WHERE inv.PlayerID = ?
    `, [id]);
    res.json(rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to fetch player inventory.' });
  }
});

// Add item to player inventory
app.post('/api/players/:id/inventory', async (req, res) => {
  const { id } = req.params;
  const { ItemName, ItemType, Rarity, Description, Quantity = 1, Durability, Attack, Defense, MaterialType, EffectType, EffectValue, Duration } = req.body;
  const maxRetries = 5;

  const executeQuery = async (attempt) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into Item table
      const [itemResult] = await connection.query('INSERT INTO Item (ItemName, ItemType, Rarity, Description) VALUES (?, ?, ?, ?)', [ItemName, ItemType, Rarity, Description]);
      const itemId = itemResult.insertId;

      // Insert into specific type table
      switch (ItemType) {
        case 'weapon':
          await connection.query('INSERT INTO Equipment (ItemID, Durability) VALUES (?, ?)', [itemId, Durability]);
          await connection.query('INSERT INTO Weapon (ItemID, Attack) VALUES (?, ?)', [itemId, Attack]);
          break;
        case 'armour':
          await connection.query('INSERT INTO Equipment (ItemID, Durability) VALUES (?, ?)', [itemId, Durability]);
          await connection.query('INSERT INTO Armour (ItemID, Defense) VALUES (?, ?)', [itemId, Defense]);
          break;
        case 'material':
          await connection.query('INSERT INTO Material (ItemID, MaterialType) VALUES (?, ?)', [itemId, MaterialType]);
          break;
        case 'consumable':
          await connection.query('INSERT INTO Consumable (ItemID, EffectType, EffectValue, Duration) VALUES (?, ?, ?, ?)', [itemId, EffectType, EffectValue, Duration]);
          break;
      }

      // Insert into Inventory table
      await connection.query('INSERT INTO Inventory (PlayerID, ItemID, Quantity) VALUES (?, ?, ?)', [id, itemId, Quantity]);

      await connection.commit();
      res.status(201).json({ message: 'Item added to inventory', itemId });
    } catch (err) {
      await connection.rollback();
      if (err.code === 'ER_LOCK_DEADLOCK' && attempt < maxRetries) {
        console.warn(`Deadlock detected, retrying... Attempt ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, 50));
        return executeQuery(attempt + 1);
      }
      console.error('Error:', err);
      res.status(500).json({ error: 'An error occurred while adding item to inventory' });
    } finally {
      connection.release();
    }
  };

  executeQuery(0);
});

// Delete item from player inventory
app.delete('/api/players/:id/inventory/:itemId', async (req, res) => {
  const { id, itemId } = req.params;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Remove from Inventory
    await connection.query('DELETE FROM Inventory WHERE PlayerID = ? AND ItemID = ?', [id, itemId]);

    // Check if the item is still in anyone's inventory
    const [inventoryCheck] = await connection.query('SELECT * FROM Inventory WHERE ItemID = ?', [itemId]);

    if (inventoryCheck.length === 0) {
      // If not in any inventory, delete from all related tables
      await connection.query('DELETE FROM Weapon WHERE ItemID = ?', [itemId]);
      await connection.query('DELETE FROM Armour WHERE ItemID = ?', [itemId]);
      await connection.query('DELETE FROM Equipment WHERE ItemID = ?', [itemId]);
      await connection.query('DELETE FROM Material WHERE ItemID = ?', [itemId]);
      await connection.query('DELETE FROM Consumable WHERE ItemID = ?', [itemId]);
      await connection.query('DELETE FROM Item WHERE ItemID = ?', [itemId]);
    }

    await connection.commit();
    res.status(204).end();
  } catch (err) {
    await connection.rollback();
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while deleting item from inventory' });
  } finally {
    connection.release();
  }
});

// Get inventory count
app.get('/api/players/:id/inventory/count', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT SUM(Quantity) as totalQuantity FROM Inventory WHERE PlayerID = ?', [id]);
    res.json({ totalQuantity: rows[0].totalQuantity || 0 });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to fetch inventory count.' });
  }
});



// Delete item from player inventory
app.delete('/api/players/:id/inventory/:itemId', async (req, res) => {
  const { id, itemId } = req.params;

  try {
    await pool.query('DELETE FROM Inventory WHERE PlayerID = ? AND ItemID = ?', [id, itemId]);
    res.status(204).end();
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while deleting item from inventory' });
  }
});

// Edit item in player inventory
app.put('/api/players/:id/inventory/:itemId', async (req, res) => {
  const { id, itemId } = req.params;
  const { ItemName, ItemType, Rarity, Description, Quantity, Durability, Attack, Defense, MaterialType, EffectType, EffectValue, Duration } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update Item table
    await connection.query('UPDATE Item SET ItemName = ?, ItemType = ?, Rarity = ?, Description = ? WHERE ItemID = ?',
      [ItemName, ItemType, Rarity, Description, itemId]);

    // Update type-specific table
    switch (ItemType) {
      case 'weapon':
        await connection.query('UPDATE Equipment SET Durability = ? WHERE ItemID = ?', [Durability, itemId]);
        await connection.query('UPDATE Weapon SET Attack = ? WHERE ItemID = ?', [Attack, itemId]);
        break;
      case 'armour':
        await connection.query('UPDATE Equipment SET Durability = ? WHERE ItemID = ?', [Durability, itemId]);
        await connection.query('UPDATE Armour SET Defense = ? WHERE ItemID = ?', [Defense, itemId]);
        break;
      case 'material':
        await connection.query('UPDATE Material SET MaterialType = ? WHERE ItemID = ?', [MaterialType, itemId]);
        break;
      case 'consumable':
        await connection.query('UPDATE Consumable SET EffectType = ?, EffectValue = ?, Duration = ? WHERE ItemID = ?',
          [EffectType, EffectValue, Duration, itemId]);
        break;
    }

    // Update Inventory table
    if (Quantity !== undefined) {
      await connection.query('UPDATE Inventory SET Quantity = ? WHERE PlayerID = ? AND ItemID = ?', [Quantity, id, itemId]);
    }

    await connection.commit();
    res.status(200).json({ message: 'Item updated successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while updating the item' });
  } finally {
    connection.release();
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



// Get average gold for each class of players
app.get('/api/players/average-gold-by-class', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT Class, AVG(Gold) as averageGold
      FROM (
        SELECT Class, Gold
        FROM Player
      ) AS PlayerGold
      GROUP BY Class
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to fetch the average gold by class.' });
  }
});

// Get players who have collected all items
app.get('/api/players/collected-all-items', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.Username
      FROM Player p
      WHERE NOT EXISTS (
        SELECT i.ItemID
        FROM Item i
        WHERE NOT EXISTS (
          SELECT pi.ItemID
          FROM Inventory pi
          WHERE pi.PlayerID = p.PlayerID AND pi.ItemID = i.ItemID
        )
      )
    `);

    if (rows.length === 0) {
      res.json({ message: 'No player has collected all items.' });
    } else {
      const usernames = rows.map(row => row.Username);
      const message =
        usernames.length === 1
          ? `${usernames[0]} has collected them all!`
          : `${usernames.join(', ')} have collected them all!`;
      res.json({ message });
    }
  } catch (err) {
    console.error('Detailed Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to find the players who collected all items.' });
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
  const { PlayerID, Notes, stats, EquippedWeapon, EquippedArmour, EquippedConsumable } = req.body;

  try {
    await pool.query('START TRANSACTION');

    // Update notes
    const notesQuery = 'UPDATE Player SET Notes = ?, WeaponID = ?, ArmourID = ?, ConsumableID = ? WHERE PlayerID = ?';
    await pool.query(notesQuery, [Notes, EquippedWeapon, EquippedArmour, EquippedConsumable, playerId]);

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

    player.EquippedWeapon

    console.log('Player details:', player);

    res.json(player);
  } catch (error) {
    console.error('Error fetching player details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/items/:itemId', async (req, res) => {
  const itemId = req.params.itemId;

  try {
    // Query to fetch basic item details
    const [itemRows] = await pool.query(`
      SELECT i.*, 
             e.Durability,
             w.Attack,
             a.Defense,
             m.MaterialType,
             c.EffectType,
             c.EffectValue,
             c.Duration
      FROM Item i
      LEFT JOIN Equipment e ON i.ItemID = e.ItemID
      LEFT JOIN Weapon w ON i.ItemID = w.ItemID
      LEFT JOIN Armour a ON i.ItemID = a.ItemID
      LEFT JOIN Material m ON i.ItemID = m.ItemID
      LEFT JOIN Consumable c ON i.ItemID = c.ItemID
      WHERE i.ItemID = ?
    `, [itemId]);

    if (itemRows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const item = itemRows[0];

    // Fetch additional stats for equipment
    if (item.ItemType === 'weapon' || item.ItemType === 'armour') {
      const [statRows] = await pool.query(`
        SELECT StatName, StatValue
        FROM EquipmentStat
        WHERE ItemID = ?
      `, [itemId]);

      item.stats = {};
      statRows.forEach(stat => {
        item.stats[stat.StatName] = stat.StatValue;
      });
    }

    console.log('Fetched item details:', item);

    res.json(item);
  } catch (error) {
    console.error('Error fetching item details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get the list of tables
app.get('/api/tables', async (req, res) => {
  try {
      // query fetches all table names from the db called 'dnd'
      const result = await pool.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_type='BASE TABLE'
          AND table_schema = 'dnd'
      `);
      // returns a list of lists of jsons where the first list contains all the json's of table names
      const tables = result[0].map(item => item.TABLE_NAME);
      res.json(tables);
  } catch (error) {
      console.error('Failed to fetch tables:', error);
      res.status(500).json({ error: 'Failed to fetch tables' });
  }
});


// Get most-populated locations
app.get('/api/location/most-populated', async (req, res) => {
  try {
    // most populated is defined by location with the most npcs
    // find the location where the count of npcs is = the max count
    const [rows] = await pool.query(`
      SELECT LocationName
      FROM Location L, NPC2 N
      WHERE L.LocationID = N.LocationID
      GROUP BY L.LocationID
      HAVING COUNT(*) = 
        (SELECT MAX(maxPopulation) 
        FROM (SELECT COUNT(*) as maxPopulation
              FROM Location L, NPC2 N
              WHERE L.LocationID = N.LocationID
              GROUP BY L.LocationID) as MaxPop);
    `);
    if (rows.length === 0) {
      // if 
      res.json({ messageString: 'No one lives.' });
    } else {
      let messageString = ''
      rows.forEach((lName, index) => {
          messageString = messageString + ' ' + lName.LocationName + ',';
      });
      messageString = messageString.slice(0, -1) + ' -> these are all the most populated locations!'
      res.json({ messageString });
    }
  } catch (err) {
    console.error('Detailed Error:', err);
    res.status(500).json({ error: 'An error occurred while trying to find the most populated Location.' });
  }
});

// Get attributes
app.get('/api/columns/:tableName', async (req, res) => {
  const { tableName } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'dnd' AND TABLE_NAME = ?
    `, [tableName]);

    // Extract column names from the result
    const columnNames = rows?.map(row => row.COLUMN_NAME);
    res.json(columnNames);
  } catch (err) {
    console.error('Error fetching column names:', err);
    res.status(500).json({ error: 'An error occurred while trying to fetch column names.' });
  }
});

// Projection function
app.get('/api/project/:tableName', async (req, res) => {
  const tableName = req.params.tableName;
  const attributes = req.query.attributes;

  if (!tableName || !attributes) {
      return res.status(400).json({ error: 'Table name and attributes are required' });
  }

  const attributeArray = attributes.split(',');
  const validAttributes = attributeArray.map(attr => attr.trim()).filter(attr => attr); // Remove any empty or invalid attributes

  if (validAttributes.length === 0) {
      return res.status(400).json({ error: 'No valid attributes provided' });
  }

  const query = `SELECT ${validAttributes.join(', ')} FROM ${tableName}`;

  try {
      const [rows] = await pool.query(query);
      res.json(rows); 
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
    const errorMessage = err.sqlMessage || `An error occurred while trying to insert into ${table}`;
    res.status(500).json({ error: errorMessage });
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