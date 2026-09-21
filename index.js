const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Anthropic client using the environment variable on Render
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Front-End Web UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Replit Brother • Claude AI</title>
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
        .chat-container {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          width: 100%;
          max-width: 650px;
          height: 80vh;
          max-height: 700px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4);
          overflow: hidden;
        }
        .chat-header {
          padding: 16px 20px;
          background: #0f172a;
          border-bottom: 1px solid #334155;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-header h1 { 
          font-size: 1.2rem; 
          color: #f8fafc;
          letter-spacing: -0.02em;
        }
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .message {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.95rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .message.user {
          align-self: flex-end;
          background: #d97706;
          color: #fff;
          border-bottom-right-radius: 2px;
        }
        .message.bot {
          align-self: flex-start;
          background: #334155;
          color: #f1f5f9;
          border-bottom-left-radius: 2px;
        }
        .chat-input-area {
          padding: 16px;
          background: #0f172a;
          border-top: 1px solid #334155;
          display: flex;
          gap: 10px;
        }
        input[type="text"] {
          flex: 1;
          padding: 12px 16px;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
        }
        input[type="text"]:focus { border-color: #d97706; }
        button {
          padding: 12px 20px;
          background: #d97706;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover { background: #b45309; }
        button:disabled { background: #475569; cursor: not-allowed; }
      </style>
    </head>
    <body>
      <div class="chat-container">
        <div class="chat-header">
          <div class="brand">
            <!-- Replit + Claude Hybrid Logo SVG -->
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Claude Style Warm Amber Outer Circle -->
              <circle cx="50" cy="50" r="48" fill="#D97706" />
              
              <!-- Replit Style Blocky "R" Emblem in Center -->
              <g fill="#0F172A">
                <!-- Top left block -->
                <rect x="28" y="28" width="18" height="18" rx="3" />
                <!-- Top right block -->
                <rect x="50" y="28" width="18" height="18" rx="3" />
                <!-- Middle left block -->
                <rect x="28" y="50" width="18" height="18" rx="3" />
                <!-- Bottom right leg block -->
                <rect x="50" y="50" width="18" height="22" rx="3" />
              </g>
            </svg>
            <h1>Replit Brother</h1>
          </div>
          <span style="font-size: 0.85rem; color: #94a3b8;">Powered by Claude</span>
        </div>

        <div class="chat-messages" id="chatBox">
          <div class="message bot">Hello! I'm Claude, running on your Replit Brother server. How can I help you today?</div>
        </div>

        <form class="chat-input-area" id="chatForm">
          <input type="text" id="userInput" placeholder="Ask Claude anything..." autocomplete="off" required />
          <button type="submit" id="sendBtn">Send</button>
        </form>
      </div>

      <script>
        const chatBox = document.getElementById('chatBox');
        const chatForm = document.getElementById('chatForm');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');

        function appendMessage(text, sender) {
          const msgDiv = document.createElement('div');
          msgDiv.className = 'message ' + sender;
          msgDiv.innerText = text;
          chatBox.appendChild(msgDiv);
          chatBox.scrollTop = chatBox.scrollHeight;
        }

        chatForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const text = userInput.value.trim();
          if (!text) return;

          appendMessage(text, 'user');
          userInput.value = '';
          sendBtn.disabled = true;
          sendBtn.innerText = 'Thinking...';

          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            appendMessage(data.reply, 'bot');
          } catch (err) {
            appendMessage("Error communicating with Claude backend.", 'bot');
          } finally {
            sendBtn.disabled = false;
            sendBtn.innerText = 'Send';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Claude API Route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: 'Please send a valid message.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ reply: 'ANTHROPIC_API_KEY is missing in Render environment variables.' });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error('Claude API Error:', error);
    res.status(500).json({ reply: 'Failed to process request with Claude.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
