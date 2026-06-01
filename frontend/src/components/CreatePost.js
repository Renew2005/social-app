import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button,
   Avatar, IconButton,
  CircularProgress, Alert
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const { user, token } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // When user selects an image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Show preview of selected image
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    setError('');
    if (!text && !image) {
      return setError('Please write something or add an image');
    }

    try {
      setLoading(true);

      // FormData is used when sending files + text together
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (image) formData.append('image', image);

      const res = await axios.post(
        'https://social-app-backend-e8b5.onrender.com/api/posts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Clear form
      setText('');
      setImage(null);
      setPreview('');

      // Tell Feed to refresh posts
      onPostCreated(res.data);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2 }}>

      {/* Top row — avatar + input */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Avatar sx={{ bgcolor: '#1976d2', mt: 0.5 }}>
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          sx={{ '& fieldset': { borderRadius: 2 } }}
        />
      </Box>

      {/* Image Preview */}
      {preview && (
        <Box mt={2}>
          <img
            src={preview}
            alt="preview"
            style={{
              width: '100%', maxHeight: 300,
              objectFit: 'cover', borderRadius: 8
            }}
          />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

      {/* Bottom row — camera icon + post button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>

        {/* Image upload button */}
        <IconButton component="label" color="primary">
          <PhotoCameraIcon />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </IconButton>

        {/* Post button */}
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handlePost}
          disabled={loading}
          sx={{ borderRadius: 2, fontWeight: 'bold' }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Post'}
        </Button>

      </Box>
    </Paper>
  );
};

export default CreatePost;