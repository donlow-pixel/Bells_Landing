require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(3000, () => console.log('Retell token server running on http://localhost:3000'));
