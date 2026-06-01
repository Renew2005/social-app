const express = require('express');
const router = express.Router();
const multer = require('multer');        // For handling image uploads
const path = require('path');
const fs = require('fs');                // For file system operations
const Post = require('../models/Post'); // Our Post blueprint
const authMiddleware = require('../middleware/authMiddleware');

// ─────────────────────────────────────────
// MULTER SETUP — Where to save uploaded images
// ─────────────────────────────────────────
// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save images to /uploads folder
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp + original name
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ─────────────────────────────────────────
// CREATE POST — POST /api/posts
// Protected: user must be logged in
// ─────────────────────────────────────────
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    // At least text or image must be provided
    if (!text && !image) {
      return res.status(400).json({ message: 'Post must have text or image' });
    }

    const newPost = new Post({
      author: req.user.userId, // From authMiddleware
      text,
      image,
    });

    await newPost.save();

    // Populate author details before sending back
    await newPost.populate('author', 'username profilePicture');

    res.status(201).json(newPost);

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// ─────────────────────────────────────────
// GET ALL POSTS (Feed) — GET /api/posts
// Public: anyone can view
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profilePicture') // Get author details
      .populate('comments.author', 'username')        // Get commenter details
      .sort({ createdAt: -1 });                       // Newest posts first

    res.status(200).json(posts);

  } catch (error) {
    console.error('Fetch posts error:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

// ─────────────────────────────────────────
// LIKE / UNLIKE POST — PUT /api/posts/:id/like
// Protected: user must be logged in
// ─────────────────────────────────────────
router.put('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.userId;

    // Check if user already liked this post
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike — remove user from likes array
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Like — add user to likes array
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      likes: post.likes,
      likesCount: post.likes.length,
    });

  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Server error liking post' });
  }
});

// ─────────────────────────────────────────
// ADD COMMENT — POST /api/posts/:id/comment
// Protected: user must be logged in
// ─────────────────────────────────────────
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Add new comment
    post.comments.push({
      author: req.user.userId,
      text,
    });

    await post.save();

    // Populate comment authors before sending back
    await post.populate('comments.author', 'username profilePicture');

    res.status(201).json({
      comments: post.comments,
      commentsCount: post.comments.length,
    });

  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

module.exports = router;