import express from 'express';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// UTILITY: Haversine Formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => degree * (Math.PI / 180);
  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// API 1: Add School
app.post('/addSchool', async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Valid Name is required.' });
    }
    if (!address || typeof address !== 'string' || address.trim() === '') {
      return res.status(400).json({ error: 'Valid Address is required.' });
    }
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      return res.status(400).json({ error: 'Valid Latitude (between -90 and 90) is required.' });
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Valid Longitude (between -180 and 180) is required.' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [name, address, latitude, longitude]);

    res.status(201).json({
      message: 'School added successfully.',
      schoolId: result.insertId,
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// API 2: List Schools
app.get('/listSchools', async (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res
        .status(400)
        .json({ error: 'Valid latitude and longitude are required in query parameters.' });
    }

    const [schools] = await pool.execute('SELECT * FROM schools');

    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(schoolsWithDistance);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Setup Database Route
app.get('/setup-db', async (req, res) => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS schools (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL
        );
    `;
  try {
    await pool.query(createTableQuery);
    res.send('Table created successfully in TiDB!');
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send(err.message);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
