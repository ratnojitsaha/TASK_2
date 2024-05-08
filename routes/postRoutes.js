const express = require('express');
const { Post } = require('../models/Post');
const authenticateToken = require('../middleware/authenticateToken');
const { postSchema } = require('../validation/postValidation');
const { z } = require('zod');

const router = express.Router();

// Create a new post with Zod validation and JWT authentication
router.post('/', authenticateToken, async (req, res) => {
  try {
    postSchema.parse(req.body); // Validate request data with Zod

    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content,
      author: req.user.userId, // The author is set to the authenticated user
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map((e) => e.message) });
    }
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username'); // Populate author details
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username'); // Populate author details

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Update a post with Zod validation and JWT authentication
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    postSchema.parse(req.body); // Validate request data with Zod

    const { title, content } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.userId }, // Ensure only the author can update
      { title, content },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors.map((e) => e.message) });
    }
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a post with JWT authentication
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId, // Ensure only the author can delete
    });

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Like a post with JWT authentication
router.put('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.likes += 1; // Increment the like count
    await post.save();

    res.status(200).json(post); // Return the updated post
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Add a comment to a post with JWT authentication
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id); // Find the post by ID

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      content,
      author: req.user.userId, // The comment's author is the authenticated user
    });

    await post.save();

    res.status(201).json(post); // Return the updated post with the new comment
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = router;
