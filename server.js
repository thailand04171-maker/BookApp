const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const session = require('express-session');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// 🔥 1. middleware แปลง json
app.use(express.json());

// 🔥 2. CORS (ก่อน session)
app.use(cors({
  origin: true,
  credentials: true
}));

// 🔥 3. SESSION (ต้องอยู่ก่อน routes)
app.use(session({
  name: 'connect.sid',
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: false, // true ถ้า https
    sameSite: 'lax',  
    maxAge: 1000 * 60 * 60 * 24 // 1 วัน
  }
}));

// 🔥 4. routes
app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/books', require('./server/routes/bookRoutes'));


// 🔥 5. connect DB
connectDB();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
