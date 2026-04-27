const express = require('express');
const app = express();
const PORT = 5000;

// ==========================================
// LEVEL 3: Custom Middleware (Global)
// ==========================================
// Log HTTP method, request URL, and current time
app.use((req, res, next) => {
    // Get current time in a simple format like 10:05 AM
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Log the format: [GET] /posts - 10:05 AM
    console.log(`[${req.method}] ${req.url} - ${time}`);
    
    // Move to the next function/route
    next();
});

// ==========================================
// LEVEL 1: Basic Setup + Middleware
// ==========================================
// Middleware to parse JSON bodies from the request
app.use(express.json());

// ==========================================
// LEVEL 2: Mock Database
// ==========================================
// Simple array to store blog posts
let blogPosts = [];

// Variable to keep track of the next ID to assign
let nextId = 1;

// ==========================================
// LEVEL 3: Authentication Route
// ==========================================
// POST /login - Fake authentication
app.post('/login', (req, res) => {
    // Accept username and password from req.body
    const username = req.body.username;
    const password = req.body.password;
    
    // No real authentication logic required, just return a fake token string
    res.json({
        token: "fake-jwt-token-12345",
        message: "Login successful!"
    });
});

// ==========================================
// LEVEL 1 & 2: Routes (CRUD Operations)
// ==========================================

// GET /posts - Return all posts
app.get('/posts', (req, res) => {
    // Return all posts from our array
    res.json(blogPosts);
});

// GET /posts/:id - Return a single post by id
app.get('/posts/:id', (req, res) => {
    // Get the ID from the URL and convert it to a number
    const id = parseInt(req.params.id);
    
    // Find the post in our array using a basic loop
    let foundPost = null;
    for (let i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id === id) {
            foundPost = blogPosts[i];
            break; // Stop looping once we find it
        }
    }
    
    // Check if we found the post
    if (foundPost !== null) {
        res.json(foundPost);
    } else {
        res.json({ message: "Post not found" });
    }
});

// POST /posts - Add a new post
app.post('/posts', (req, res) => {
    // Take title and content from req.body
    const title = req.body.title;
    const content = req.body.content;
    
    // Create a new post object
    const newPost = {
        id: nextId,
        title: title,
        content: content
    };
    
    // Increase the next ID for the next post
    nextId++;
    
    // Add the new post to our array
    blogPosts.push(newPost);
    
    // Return a success message and the newly created post
    res.json({
        message: "Post created successfully",
        post: newPost
    });
});

// PUT /posts/:id - Update a post
app.put('/posts/:id', (req, res) => {
    // Get the ID from the URL
    const id = parseInt(req.params.id);
    
    // Get new title and content from req.body
    const newTitle = req.body.title;
    const newContent = req.body.content;
    
    // Find the post and update it using a basic loop
    let updated = false;
    for (let i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id === id) {
            // Update the values
            blogPosts[i].title = newTitle;
            blogPosts[i].content = newContent;
            updated = true;
            break; // Stop looping once updated
        }
    }
    
    // Return a response based on whether we updated it or not
    if (updated === true) {
        res.json({ message: "Post updated successfully" });
    } else {
        res.json({ message: "Post not found" });
    }
});

// DELETE /posts/:id - Remove a post
app.delete('/posts/:id', (req, res) => {
    // Get the ID from the URL
    const id = parseInt(req.params.id);
    
    // Find the index of the post
    let indexToRemove = -1;
    for (let i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id === id) {
            indexToRemove = i;
            break; // Stop looping once we find the index
        }
    }
    
    // If we found the post (index is not -1), remove it
    if (indexToRemove !== -1) {
        // Remove 1 item at the specific index
        blogPosts.splice(indexToRemove, 1);
        res.json({ message: "Post deleted successfully" });
    } else {
        res.json({ message: "Post not found" });
    }
});

// ==========================================
// Start the Server
// ==========================================
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
