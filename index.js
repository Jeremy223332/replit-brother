const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Replit Brother • AI Assistant</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .chat-container { background: #1e293b; border: 1px solid #334155; border-radius: 12px; width: 100%; max-width: 650px; height: 80vh; max-height: 700px; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 16px 20px; background: #0f172a; border-bottom: 1px solid #334155; display: flex; align-items: center; justify-content: space-between; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .message { max-width: 85%; padding: 12px 16px; border-radius: 10px; font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap; }
        .message.user { align-self: flex-end; background: #d97706; color: #fff; }
        .message.bot { align-self: flex-start; background: #334155; color: #f1f5f9; }
        .chat-input-area { padding: 16px; background: #0f172a; border-top: 1px solid #334155; display: flex; gap: 10px; }
        input[type="text"] { flex: 1; padding: 12px 16px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; color: #fff; outline: none; }
        button { padding: 12px 20px; background: #d97706; border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="chat-container">
        <div class="chat-header">
          <div class="brand">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="#D97706"/><g fill="#0F172A"><rect x="28" y="28" width="18" height="18" rx="3"/><rect x="50" y="28" width="18" height="18" rx="3"/><rect x="28" y="50" width="18" height="18" rx="3"/><rect x="50" y="50" width="18" height="22" rx="3"/></g></svg>
            <h1>Replit Brother</h1>
          </div>
          <span style="font-size: 0.85rem; color: #94a3b8;">Powered by Gemini</span>
        </div>
        <div class="chat-messages" id="chatBox">
          <div class="message bot">Hello! I'm Replit's Brother AND Gemini's Brother! How may I help?</div>
        </div>
        <form class="chat-input-area" id="chatForm">
          <input type="text" id="userInput" placeholder="Ask anything..." autocomplete="off" required />
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

          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            appendMessage(data.reply, 'bot');
          } catch (err) {
            appendMessage("Error communicating with backend.", 'bot');
          } finally {
            sendBtn.disabled = false;
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ reply: 'GEMINI_API_KEY missing in Render environment.' });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ reply: `Gemini Error: ${data.error?.message || 'Failed request'}` });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ reply: 'Failed to communicate with Gemini.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
