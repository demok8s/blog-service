// models/Blog.js

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  user_id: String,
});

module.exports = mongoose.model('Blog', blogSchema);
