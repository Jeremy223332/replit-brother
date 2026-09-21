const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON or form data if needed
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve embedded HTML, CSS, and Client-Side JS at the root route
app.get('/', (req, res) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application</title>
  <style>
    :root {
      --bg: #121212;
      --panel: #1e1e1e;
      --accent: #007acc;
      --text: #ffffff;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      background: var(--panel);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    button {
      background: var(--accent);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    }
    button:hover {
      background: #005999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>App Interface</h1>
    <p id="status">Click the button to run the action.</p>
    <button id="actionBtn">Execute Action</button>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('actionBtn');
      const status = document.getElementById('status');

      btn.addEventListener('click', async () => {
        status.textContent = 'Processing...';
        
        try {
          // Example client-side API call back to the backend
          const response = await fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timestamp: new Date().toISOString() })
          });
          
          const data = await response.json();
          status.textContent = data.message || 'Action completed!';
        } catch (error) {
          console.error('Error executing action:', error);
          status.textContent = 'Failed to execute action.';
        }
      });
    });
  </script>
</body>
</html>
  `;

  res.send(htmlContent);
});

// Example API endpoint targeted by the client script
app.post('/api/action', (req, res) => {
  console.log('Received payload:', req.body);
  res.json({ message: 'Server processed the request successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
