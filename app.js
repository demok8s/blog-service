// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const blogRoutes = require('./routes/blogRoutes');
const { swaggerUi, specs } = require('./swagger');
const { logger } = require('./logger')

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/blog', blogRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
