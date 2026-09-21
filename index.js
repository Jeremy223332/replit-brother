const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Main HTML Page / Web UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Replit Brother Hub</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background: #0f172a;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          text-align: center;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 8px;
          color: #38bdf8;
        }
        p.subtitle {
          color: #94a3b8;
          margin-bottom: 24px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #064e3b;
          color: #34d399;
          padding: 6px 16px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 24px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: #34d399;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 2s infinite;
        }
        .card {
          background: #0f172a;
          border-radius: 8px;
          padding: 16px;
          text-align: left;
          margin-bottom: 16px;
          border: 1px solid #1e293b;
        }
        .card h3 {
          font-size: 0.9rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .card code {
          color: #e2e8f0;
          font-family: monospace;
          word-break: break-all;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Replit Brother</h1>
        <p class="subtitle">Media Relay & Stream Controller</p>
        
        <div class="status-badge">
          <span class="dot"></span> Service Operational
        </div>

        <div class="card">
          <h3>Health Endpoint</h3>
          <code>GET /api/status</code>
        </div>

        <div class="card">
          <h3>Active Server Info</h3>
          <code>Hosted on Render • Auto-Deploy via GitHub</code>
        </div>
      </div>
    </body>
    </html>
  `);
});

// JSON API endpoint for health checks
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'Replit Brother',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Render dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
