const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for cross-origin requests
app.use(cors());

// Enable JSON body parsing for POST/PUT requests
app.use(express.json());

// Root endpoint - Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'MERN Backend Server is running smoothly!',
    timestamp: new Date().toISOString()
  });
});

// GET API endpoint - Fetch greeting from backend
app.get('/api/hello', (req, res) => {
  res.json({
    status: 'success',
    message: 'Hello my dear friends! Connection from React frontend to Express backend is successful! 🎉',
    timestamp: new Date().toISOString()
  });
});

// POST API endpoint - Send data from frontend to backend
app.post('/api/message', (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a non-empty message!'
    });
  }

  res.json({
    status: 'success',
    receivedMessage: text,
    serverReply: `Backend processed your message: "${text}" successfully!`,
    timestamp: new Date().toISOString()
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});
