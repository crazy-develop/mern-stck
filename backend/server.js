require ('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');


const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
  throw new Error('MONGODB_URI and DB_NAME must be set in backend/.env');
}

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let messagesCollection;

app.get('/api/hello', async (req, res) => {
  try {
    const message = await messagesCollection.findOne({ key: 'hello' });
    res.json({
      message: message?.txt || 'No MongoDB message found'
    });
  } catch (error) {
    console.error('Could not read from MongoDB:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

async function startServer() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    messagesCollection = db.collection('message');

    await messagesCollection.updateOne(
      { key: 'hello' },
      {
        $setOnInsert: {
          txt: 'hello from MongoDB',
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

startServer();
// }
// // Root endpoint - Health check
// app.get('/', (req, res) => {
//   res.json({
//     status: 'online',
//     message: 'MERN Backend Server is running smoothly!',
//     timestamp: new Date().toISOString()
//   });
// });

// // GET API endpoint - Fetch greeting from backend
// app.get('/api/hello', (req, res) => {
//   res.json({
//     status: 'success',
//     message: 'Hello my dear friends! Connection from React frontend to Express backend is successful! 🎉',
//     timestamp: new Date().toISOString()
//   });
// });

// // POST API endpoint - Send data from frontend to backend
// app.post('/api/message', (req, res) => {
//   const { text } = req.body;
  
//   if (!text || text.trim() === '') {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Please provide a non-empty message!'
//     });
//   }

//   res.json({
//     status: 'success',
//     receivedMessage: text,
//     serverReply: `Backend processed your message: "${text}" successfully!`,
//     timestamp: new Date().toISOString()
//   });
// });

// // Start Express Server
// app.listen(PORT, () => {
//   console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
// });
