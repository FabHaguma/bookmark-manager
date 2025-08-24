const express = require('express');
const cors = require('cors');
const bookmarkRoutes = require('./routes/bookmarks');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// API Routes
app.use('/api/bookmarks', bookmarkRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});