const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    // Who created this post (linked to User)
    author: {
      type: mongoose.Schema.Types.ObjectId, // Stores the User's ID
      ref: 'User',                          // References the User model
      required: true,
    },

    // The text content of the post (optional)
    text: {
      type: String,
      default: '',
    },

    // The image file path (optional)
    image: {
      type: String,
      default: '',
    },

    // Array of User IDs who liked this post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Array of comment objects
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,  // Auto set time when comment is made
        },
      },
    ],
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt to posts
  }
);

module.exports = mongoose.model('Post', PostSchema);