require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/styles.css', (req, res) => res.sendFile(path.join(__dirname, 'styles.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(__dirname, 'script.js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.get('/V2', (req, res) => res.sendFile(path.join(__dirname, 'V2', 'index.html')));
app.use('/V2', express.static(path.join(__dirname, 'V2')));

app.post('/get-access-token', async (req, res) => {
  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RETELL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agent_id: process.env.RETELL_AGENT_ID })
    });

    const data = await response.json();
    console.log('Retell API response status:', response.status);
    console.log('Retell API response body:', JSON.stringify(data, null, 2));
    if (!data.access_token) {
      return res.status(500).json({ error: 'Failed to get access token', detail: data });
    }
    res.json({ access_token: data.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('V2 widget test page: http://localhost:3000/V2');
});
