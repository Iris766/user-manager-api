const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');

dotenv.config();

// db connection
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => console.log('DB Connected!!!')
);

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes require
const authRoutes = require('./routes/auth');
// routes middleware
app.use('/', authRoutes);

app.listen(5000, () => console.log('server is started'));
