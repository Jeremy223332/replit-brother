const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());
app.use(express.json());

// Health check route for Render
app.get('/', (req, res) => {
  res.send('Replit Brother Service is Live!');
});

// Example API / Stream status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', timestamp: new Date() });
});

// Dynamic port assignment required by Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
