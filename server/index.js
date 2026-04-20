const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})

app.use('/api/auth',  require('./routes/auth'));
app.use('/api/polls', require('./routes/polls'));
app.use('/api/votes', require('./routes/votes'));

app.listen(5000, () => console.log('Server on port 5000'));