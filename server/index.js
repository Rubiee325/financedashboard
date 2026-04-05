const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const seedRoutes = require('./routes/seedRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});
const authRoutes = require('./routes/authRoutes');
const auth = require('./middleware/auth');


// ✅ CORS MUST BE FIRST
app.use(cors({
  origin: [
    "http://localhost:5173",
    // "https://dashboard-builder-eight.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("🚀 Dashboard Builder API is running!");
});

// Middleware


app.use(helmet({
  contentSecurityPolicy: false, // For development ease
}));
app.use(morgan('dev'));

// Attach IO to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Final Robust Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI ;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log("DB:", MONGODB_URI)
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
