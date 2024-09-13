const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../client')));

// Use JSON middleware for parsing application/json
app.use(express.json());

// Use multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Use upload route
app.use('/upload', upload.single('document'), uploadRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
