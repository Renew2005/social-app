// 1. Import required packages
const express = require('express');        // Express helps us create a web server
const mongoose = require('mongoose');      // Mongoose helps us talk to MongoDB
const cors = require('cors');              // CORS allows frontend (React) to call this backend
const dotenv = require('dotenv');          // dotenv loads our secret variables from .env file
const path = require('path');             // path helps us work with file/folder paths

// 2. Load environment variables from .env file
dotenv.config();

// 3. Create the Express app (our server)
const app = express();

// 4. Middlewares — these run on EVERY request before it reaches your routes
app.use(cors());                           // Allow all cross-origin requests (frontend ↔ backend)
app.use(express.json());                   // Allow server to read JSON data sent from frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
// 👆 This makes the "uploads" folder publicly accessible (for images)

// 5. Import Routes
const authRoutes = require('./routes/auth');    // Routes for signup/login
const postRoutes = require('./routes/posts');   // Routes for posts/likes/comments

// 6. Use Routes — any request starting with /api/auth goes to authRoutes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 7. Connect to MongoDB using the URI from .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((error) => {
    console.log('❌ MongoDB Connection Failed:', error.message);
  });

// 8. Start the server and listen on the port from .env (5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});