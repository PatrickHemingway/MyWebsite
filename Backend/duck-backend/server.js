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
app.get('/races', async (req, res) => {
  try {

    /*// Console log the entire request object
    console.log(req);
    // Console log specific parts of the request
    console.log("Headers:", req.headers);
    console.log("URL:", req.url);
    console.log("Method:", req.method);
    console.log("Query parameters:", req.query);*/

    const result = await pool.query('SELECT * FROM races ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Endpoint to get all of the ducks
app.get('/races/:raceId/ducks', async (req, res) => {
    const { raceId } = req.params;
    try {
      const result = await pool.query(
        'SELECT * FROM race_ducks WHERE race_id = $1 ORDER BY id',
        [raceId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching ducks for race');
    }
  });

  app.post('/races', async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Race name is required' });
    }
  
    try {
      await pool.query('INSERT INTO races (name) VALUES ($1)', [name]);
      res.status(201).json({ status: 'success', message: 'Race created' });
    } catch (err) {
      console.error('Error creating race:', err);
      res.status(500).send('Server error');
    }
  });
  
  app.delete('/races/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM races WHERE id = $1', [id]);
      res.status(200).json({ status: 'success', message: 'Race deleted' });
    } catch (err) {
      console.error('Error deleting race:', err);
      res.status(500).send('Error deleting race');
    }
  });  

  app.post('/races/:raceId/ducks', async (req, res) => {
    const { raceId } = req.params;
    const { name } = req.body;
  
    try {
      if (!name) return res.status(400).json({ error: 'Duck name required' });
  
      await pool.query(
        'INSERT INTO race_ducks (race_id, name) VALUES ($1, $2)',
        [raceId, name]
      );
  
      res.status(201).json({ status: 'success', message: 'Duck added to race' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding duck');
    }
  });
  

// PATCH to increment losses
// PATCH to increment losses
// PATCH to increment a single duck's losses in a specific race
app.patch('/races/:raceId/ducks/:duckId/loss', async (req, res) => {
    const { raceId, duckId } = req.params;
    try {
      await pool.query(
        'UPDATE race_ducks SET losses = losses + 1 WHERE id = $1 AND race_id = $2',
        [duckId, raceId]
      );
  
      const result = await pool.query(
        'SELECT * FROM race_ducks WHERE id = $1 AND race_id = $2',
        [duckId, raceId]
      );
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating losses');
    }
  });
  

  
// PATCH to mark one duck as winner: reset its losses to 0, others +1
app.patch('/races/:raceId/ducks/:duckId/win', async (req, res) => {
    const { raceId, duckId } = req.params;
    const client = await pool.connect();
  
    try {
        await client.query('BEGIN');
    
        // Increment total races
        await client.query('UPDATE races SET total_races = total_races + 1 WHERE id = $1', [raceId]);
    
        // Increment winner's wins
        await client.query('UPDATE race_ducks SET wins = wins + 1 WHERE id = $1 AND race_id = $2', [duckId, raceId]);
    
        // Reset the winning duck
        await client.query('UPDATE race_ducks SET losses = 0 WHERE id = $1', [duckId]);

        // Increment losses for everyone else
        await client.query(
            'UPDATE race_ducks SET losses = losses + 1 WHERE race_id = $1 AND id != $2',
            [raceId, duckId]
        );
    
        await client.query('COMMIT');
    
        const result = await client.query('SELECT * FROM race_ducks WHERE race_id = $1 ORDER BY id', [raceId]);
        res.json(result.rows);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).send('Race update failed');
    } finally {
      client.release();
    }
  });
  
  // PATCH to reset all duck losses to 0
  app.patch('/races/:raceId/reset', async (req, res) => {
    const { raceId } = req.params;
  
    try {
      await pool.query('UPDATE race_ducks SET wins = 0, losses = 0 WHERE race_id = $1', [raceId]);
      await pool.query('UPDATE races SET total_races = 0 WHERE id = $1', [raceId]);
  
      const result = await pool.query('SELECT * FROM race_ducks WHERE race_id = $1', [raceId]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error resetting race');
    }
  });    

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
