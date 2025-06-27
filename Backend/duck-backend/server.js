// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'duck_race_db',
  password: 'postgres', 
  port: 5432,
});

// Endpoint to get all ducks
app.get('/ducks', async (req, res) => {
  try {

    // Console log the entire request object
    console.log(req);
    // Console log specific parts of the request
    console.log("Headers:", req.headers);
    console.log("URL:", req.url);
    console.log("Method:", req.method);
    console.log("Query parameters:", req.query);

    const result = await pool.query('SELECT * FROM ducks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post("/ducks", async (req, res) => {
    try {
        const { name, losses } = req.body;
        if (!name) {
            //Needs values
            return res.status(400).send({ error: 'Duck name required'});
        };
        res.status(201).send({
            status: 'success',
            message: 'Created Succesfully'
        });
    } catch (err) {
        console.error("Error", err);
        res.status(500).send("A floatless duck :(");
    }
});

// PATCH to increment losses
app.patch('/ducks/:id/loss', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('UPDATE ducks SET losses = losses + 1 WHERE id = $1', [id]);
      const result = await pool.query('SELECT * FROM ducks WHERE id = $1', [id]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating losses');
    }
  });
  
// PATCH to mark one duck as winner: reset its losses to 0, others +1
app.patch('/ducks/:id/win', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      // Reset the winning duck
      await client.query('UPDATE ducks SET losses = 0 WHERE id = $1', [id]);
  
      // Increment all other ducks' losses
      await client.query('UPDATE ducks SET losses = losses + 1 WHERE id != $1', [id]);
  
      await client.query('COMMIT');
  
      // Return updated duck list
      const result = await client.query('SELECT * FROM ducks ORDER BY id');
      res.json(result.rows);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Win logic failed:', err);
      res.status(500).send('Server error');
    } finally {
      client.release();
    }
  });

  // PATCH to reset all duck losses to 0
    app.patch('/ducks/reset', async (req, res) => {
    try {
      await pool.query('UPDATE ducks SET losses = 0');
      const result = await pool.query('SELECT * FROM ducks ORDER BY id');
      res.json(result.rows);
    } catch (err) {
      console.error('Reset error:', err);
      res.status(500).send('Error resetting ducks');
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
