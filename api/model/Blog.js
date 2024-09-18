const mongoose = require('mongoose');

// Define the blog schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,  // Blog title is mandatory
        trim: true
    },
    content: {
        type: String,
        required: true    // Blog content is mandatory
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,  // References the User model
        ref: 'user',
        required: true   // Every blog must have an author
    }
});


const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
