const express = require('express');
const app = express();
const PORT = 5000;

app.use((req, res, next) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    console.log(`[${req.method}] ${req.url} - ${time}`);
    next();
});

app.use(express.json());

let blogPosts = [];
let nextId = 1;

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    res.json({
        token: "fake-jwt-token-12345",
        message: "Login successful!"
    });
});

app.get('/posts', (req, res) => {
    res.json(blogPosts);
});

app.get('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    let foundPost = null;
    for (let i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id === id) {
            foundPost = blogPosts[i];
            break;
        }
    }
    
    if (foundPost !== null) {
        res.json(foundPost);
    } else {
        res.json({ message: "Post not found" });
    }
});

app.post('/posts', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    
    const newPost = {
        id: nextId,
        title: title,
        content: content
    };
    
    nextId++;
    blogPosts.push(newPost);
    
    res.json({
        message: "Post created successfully",
        post: newPost
    });
});

app.put('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newTitle = req.body.title;
    const newContent = req.body.content;
    
    let updated = false;
    for (let i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id === id) {
            blogPosts[i].title = newTitle;
            blogPosts[i].content = newContent;
            updated = true;
            break;
        }
    }
    
    if (updated === true) {
        res.json({ message: "Post updated successfully" });
    } else {
        res.json({ message: "Post not found" });
    }
});

app.delete('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    let indexToRemove = -1;
    for (let i = 0; i < blogPosts.length; i++) {
        if (blogPosts[i].id === id) {
            indexToRemove = i;
            break;
        }
    }
    
    if (indexToRemove !== -1) {
        blogPosts.splice(indexToRemove, 1);
        res.json({ message: "Post deleted successfully" });
    } else {
        res.json({ message: "Post not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
