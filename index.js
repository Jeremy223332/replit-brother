const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Memory store for the active ERLC API Key
let currentErlcKey = process.env.ERLC_API_KEY || '';

// Main Web Dashboard with Input Form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Replit Brother • ERLC Setup</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #0f172a;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
        }
        h1 { color: #38bdf8; font-size: 1.6rem; margin-bottom: 8px; }
        p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; }
        label { display: block; font-size: 0.85rem; color: #cbd5e1; margin-bottom: 6px; font-weight: 600; }
        input[type="text"] {
          width: 100%;
          padding: 12px;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 6px;
          color: #fff;
          font-size: 0.9rem;
          margin-bottom: 16px;
          outline: none;
        }
        input[type="text"]:focus { border-color: #38bdf8; }
        button {
          width: 100%;
          padding: 12px;
          background: #0284c7;
          border: none;
          border-radius: 6px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover { background: #0369a1; }
        .status {
          margin-top: 16px;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          display: none;
        }
        .success { background: #064e3b; color: #34d399; }
        .error { background: #7f1d1d; color: #fca5a5; }
        .active-key {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #334155;
          font-size: 0.8rem;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Connect ERLC Server</h1>
        <p>Paste your Police Roleplay Community API Server Key below to connect your server.</p>
        
        <form id="keyForm">
          <label for="apiKey">ERLC Server API Key</label>
          <input type="text" id="apiKey" placeholder="Paste key here..." required />
          <button type="submit">Save & Connect Key</button>
        </form>

        <div id="statusBox" class="status"></div>

        <div class="active-key">
          Current Key Status: <strong id="keyState">${currentErlcKey ? 'Key Connected' : 'No Key Set'}</strong>
        </div>
      </div>

      <script>
        document.getElementById('keyForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const key = document.getElementById('apiKey').value.trim();
          const statusBox = document.getElementById('statusBox');

          try {
            const res = await fetch('/api/set-key', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key })
            });
            const data = await res.json();

            if (res.ok) {
              statusBox.className = 'status success';
              statusBox.innerText = 'Server key saved and logged successfully!';
              statusBox.style.display = 'block';
              document.getElementById('keyState').innerText = 'Key Connected';
              document.getElementById('apiKey').value = '';
            } else {
              throw new Error(data.error);
            }
          } catch (err) {
            statusBox.className = 'status error';
            statusBox.innerText = err.message || 'Failed to save key.';
            statusBox.style.display = 'block';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Endpoint to receive, store, and log the submitted API Key
app.post('/api/set-key', (req, res) => {
  const { key } = req.body;
  
  if (!key) {
    return res.status(400).json({ error: 'Please provide a valid API key.' });
  }

  currentErlcKey = key;
  
  // Logs the key directly to Render server logs
  console.log(`[ERLC KEY LOGGED]: Key received at ${new Date().toISOString()}`);
  console.log(`[LOGGED KEY]: ${key}`);

  res.json({ success: true, message: 'Key connected and logged successfully.' });
});

// Helper function to query ERLC API
async function fetchErlc(endpoint, res) {
  if (!currentErlcKey) {
    return res.status(400).json({ error: 'No ERLC Server Key connected yet. Paste your key on the homepage.' });
  }

  try {
    const response = await axios.get(`https://api.policeroleplay.community/v1${endpoint}`, {
      headers: { 'Server-Key': currentErlcKey }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: 'ERLC API Request Failed',
      details: err.response?.data || err.message
    });
  }
}

// Sample API Routes using the logged/stored key
app.get('/api/erlc/server', (req, res) => fetchErlc('/server', res));
app.get('/api/erlc/players', (req, res) => fetchErlc('/server/players', res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Replit Brother Server active on port ${PORT}`);
});
