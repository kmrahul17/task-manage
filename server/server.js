const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const estimateRoutes = require('./routes/estimate');
const aiEstimateRoutes = require('./routes/aiEstimate');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Remove this line as cors is already imported above
// const cors = require('cors');

const corsOptions = {
  origin: ['https://cute-gnome-1447e8.netlify.app', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Add this before your routes
app.options('*', cors(corsOptions));

// Add this middleware to handle preflight requests and set headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://cute-gnome-1447e8.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/ai-estimate', aiEstimateRoutes);

// Add this near your other route definitions
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
