const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Blog = require('../model/Blog');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, token not found' });
    }

    try {
        // Verify the token using the secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  // Attach the verified user data to the request
        next();  // Proceed to the next middleware
    } catch (err) {
        console.log('Error verifying token:', err);
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Route to create a new blog post
router.post('/blog', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;  // Extract user ID from verified token

    try {
        // Check if the user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new blog post
        const newBlog = new Blog({
            title,
            content,
            author: userId
        });

        // Save the new blog post to the database
        const savedBlog = await newBlog.save();

        res.status(201).json({
            message: 'Blog post created successfully',
            blog: savedBlog
        });
    } catch (error) {
        console.error('Error while creating blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/blogs', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        // Await the find() method since it's an async operation
        const blogs = await Blog.find({ author:userId });

        // Check if no blogs are found
        if (!blogs || blogs.length === 0) {
            return res.status(400).json({ message: 'This user has not posted anything' });
        }

        // Return the blogs if found
        res.status(200).json({
            message: 'Here are the blogs',
            blogs
        });

    } catch (error) {
        console.log('Error fetching blogs:', error);
        res.status(500).json({ message: 'Unable to find blogs' });
    }
});


module.exports = router;
