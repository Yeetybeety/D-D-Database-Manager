const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const port = 3001;
require('dotenv').config();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // This line is crucial for parsing JSON request bodies

const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: dbPassword,
  database: dbName
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Create an Entity
const createEntity = (tableName, req, res) => {
  const { ...data } = req.body;
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data);
  const placeholders = values.map(() => '?').join(', ');

  const table = capitalizeFirstLetter(tableName)
  console.log("Inserting into table: ", table);

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  db.query(query, values, (err, result) => {
    if (err) {
      console.error(`Error inserting into ${table}:`, err);
      return res.status(500).send(`Error inserting into ${table}`);
    }
    res.json({ ...data, ID: result.insertId });
  });
};

function capitalizeFirstLetter(str) {
  return str.replace(/^\w/, c => c.toUpperCase());
}


// Edit specific Entity from table
const updateEntity = (tableName, req, res) => {
  const id = req.params.id;
  const { ...data } = req.body;
  const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const [firstValue] = Object.values(data);
  const values = [...Object.values(data), firstValue];

  const table = capitalizeFirstLetter(tableName)
  const columnName = `${table}ID`;

  const query = `UPDATE ${table} SET ${columns} WHERE ${columnName} = ?`;
  db.query(query, values, (err, result) => {
    if (err) {
      console.error(`Error updating ${table}:`, err);
      return res.status(500).send(`Error updating ${table}`);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send(`${table} not found`);
    }
    res.json(data);
  });
  
};


// Delete specific Entity from Table
const deleteEntity = (tableName, req, res) => {
  const id = req.params.id;
  console.log(id);
  const table = capitalizeFirstLetter(tableName)
  const columnName = `${table}ID`;

  const query = `DELETE FROM ${table} WHERE ${columnName} = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(`Error deleting from ${table}:`, err);
      return res.status(500).send(`Error deleting from ${table}`);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send(`${table} not found`);
    }
    res.sendStatus(204);
    console.log("Successful Deletion");
  });
};

// Get all entities relating to that Table
const getEntities = (tableName, req, res) => {
  const table = capitalizeFirstLetter(tableName)

  db.query(`SELECT * FROM ${table}`, (err, results) => {
    if (err) {
      console.error(`Error fetching from ${table}:`, err);
      return res.status(500).send(`Error fetching from ${table}`);
    }
    res.json(results);
  });
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

// app.get('/api/players', (req, res) => {
//   db.query('SELECT * FROM Player2', (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Create a new quest
// app.post('/api/quests', (req, res) => {
//   const { QuestID, QuestName, Description, Status, Progress } = req.body;

//   // Ensure all required fields are provided
//   if (!QuestID || !QuestName || !Description || !Status || !Progress) {
//     return res.status(400).send('Missing required fields');
//   }

//   const query = 'INSERT INTO Quest (QuestID, QuestName, Description, Status, Progress) VALUES (?, ?, ?, ?, ?)';
//   db.query(query, [QuestID, QuestName, Description, Status, Progress], (err, result) => {
//     if (err) {
//       console.error('Error inserting quest:', err);
//       return res.status(500).send('Error inserting quest');
//     }
//     res.json({ QuestID, QuestName, Description, Status, Progress });
//   });
// });

// // Update an existing quest
// app.put('/api/quests/:id', (req, res) => {
//   const questId = req.params.id;
//   const { QuestName, Description, Status, Progress } = req.body;

//   // Ensure all required fields are provided
//   if (!QuestName || !Description || !Status || !Progress) {
//     return res.status(400).send('Missing required fields');
//   }

//   const query = 'UPDATE Quest SET QuestName = ?, Description = ?, Status = ?, Progress = ? WHERE QuestID = ?';
//   db.query(query, [QuestName, Description, Status, Progress, questId], (err, result) => {
//     if (err) {
//       console.error('Error updating quest:', err);
//       return res.status(500).send('Error updating quest');
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).send('Quest not found');
//     }
//     res.json({ QuestID: questId, QuestName, Description, Status, Progress });
//   });
// });

// // Delete a quest
// app.delete('/api/quests/:id', (req, res) => {
//   const questId = req.params.id;
//   const query = 'DELETE FROM Quest WHERE QuestID = ?';
//   db.query(query, [questId], (err, result) => {
//     if (err) throw err;
//     res.json({ message: 'Quest deleted successfully' });
//   });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app;