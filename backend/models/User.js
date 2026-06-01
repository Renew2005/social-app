const mongoose = require('mongoose');

// This is the "shape" of a user in the database
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,       // Must be text
      required: true,     // Cannot be empty
      unique: true,       // No two users can have same username
      trim: true,         // Removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,       // No two users can have same email
      lowercase: true,    // Always store email in lowercase
    },
    password: {
      type: String,
      required: true,     // We'll store the HASHED version, never plain text
    },
    profilePicture: {
      type: String,
      default: '',        // Optional — empty by default
    },
    bio: {
      type: String,
      default: '',        // Optional short bio
    },
  },
  {
    timestamps: true,     // Auto adds createdAt and updatedAt fields
  }
);

// Export so other files can use this model
module.exports = mongoose.model('User', UserSchema);