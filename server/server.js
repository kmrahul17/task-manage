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

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/ai-estimate', aiEstimateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
