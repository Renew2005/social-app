import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Box,
  Typography, Avatar, IconButton,
  Chip, Collapse, Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

const PostCard = ({ post }) => {
  const { user, token } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);

  // Check if current user already liked this post
  const isLiked = likes.some(
    (id) => id === user?.id || id?._id === user?.id
  );

  const handleLike = async () => {
    try {
      const res = await axios.put(
        `https://social-app-backend-e8b5.onrender.com/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
      <CardContent>

        {/* Author Info Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              {post.author?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography fontWeight="bold" variant="body1">
                {post.author?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Show "You" badge if it's current user's post */}
          {post.author?._id === user?.id && (
            <Chip label="You" size="small" color="primary" variant="outlined" />
          )}
        </Box>

        {/* Post Text */}
        {post.text && (
          <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.6 }}>
            {post.text}
          </Typography>
        )}

      </CardContent>

      {/* Post Image */}
      {post.image && (
        <CardMedia
          component="img"
          image={`https://social-app-backend-e8b5.onrender.com${post.image}`}
          alt="post"
          sx={{ maxHeight: 400, objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ pt: 1 }}>

        {/* Like and Comment Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

          {/* Like Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLike} size="small" color={isLiked ? 'error' : 'default'}>
              {isLiked
                ? <FavoriteIcon fontSize="small" />
                : <FavoriteBorderIcon fontSize="small" />
              }
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
            </Typography>
          </Box>

          {/* Comment Toggle Button */}
          <Button
            startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
            size="small"
            color="inherit"
            onClick={() => setShowComments(!showComments)}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>

        </Box>

        {/* Comments Section — shown/hidden on toggle */}
        <Collapse in={showComments}>
          <CommentSection
            postId={post._id}
            comments={comments}
            onCommentAdded={(newComments) => setComments(newComments)}
          />
        </Collapse>

      </CardContent>
    </Card>
  );
};

export default PostCard;