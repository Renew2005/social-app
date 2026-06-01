import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography,
  Avatar, Divider, CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const { token, user } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComment = async () => {
    if (!text.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `https://social-app-backend-e8b5.onrender.com/api/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      // Tell PostCard to update comments
      onCommentAdded(res.data.comments);
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Divider sx={{ mb: 1.5 }} />

      {/* Existing Comments */}
      {comments.map((comment, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: '#1976d2' }}>
            {comment.author?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 2, px: 1.5, py: 0.8, flex: 1 }}>
            <Typography variant="caption" fontWeight="bold" color="primary">
              @{comment.author?.username}
            </Typography>
            <Typography variant="body2">{comment.text}</Typography>
          </Box>
        </Box>
      ))}

      {/* Add new comment */}
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: '#1976d2' }}>
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleComment()}
          sx={{ '& fieldset': { borderRadius: 2 } }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleComment}
          disabled={loading}
          sx={{ minWidth: 40, borderRadius: 2 }}
        >
          {loading
            ? <CircularProgress size={16} color="inherit" />
            : <SendIcon fontSize="small" />
          }
        </Button>
      </Box>
    </Box>
  );
};

export default CommentSection;