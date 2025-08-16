const express = require('express');
const cors = require('cors');
const path = require('path');
const { setupAuth } = require('./auth');
const { registerRoutes } = require('./routes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Setup authentication
setupAuth(app);

// Register API routes
registerRoutes(app);

// Serve React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
