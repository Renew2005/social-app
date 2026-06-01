import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, CircularProgress,
  Alert, Tabs, Tab, Divider
} from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0); // 0=All, 1=Most Liked, 2=Most Commented

  // Fetch all posts when page loads
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // When a new post is created, add it to top of feed instantly
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Filter posts based on selected tab
  const getFilteredPosts = () => {
    switch (tab) {
      case 1:
        // Most Liked — sort by likes count descending
        return [...posts].sort(
          (a, b) => b.likes.length - a.likes.length
        );
      case 2:
        // Most Commented — sort by comments count descending
        return [...posts].sort(
          (a, b) => b.comments.length - a.comments.length
        );
      default:
        // All Posts — newest first (already sorted from backend)
        return posts;
    }
  };

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh' }}>

      {/* Top Navigation Bar */}
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 3 }}>

        {/* Create Post Box */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Filter Tabs — inspired by TaskPlanet */}
        <Box sx={{ bgcolor: '#fff', borderRadius: 3, mb: 2, overflow: 'hidden' }}>
          <Tabs
            value={tab}
            onChange={(e, newVal) => setTab(newVal)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="All Posts" sx={{ fontWeight: 'bold', fontSize: 12 }} />
            <Tab label="Most Liked" sx={{ fontWeight: 'bold', fontSize: 12 }} />
            <Tab label="Most Commented" sx={{ fontWeight: 'bold', fontSize: 12 }} />
          </Tabs>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No posts yet 👀
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to post something!
            </Typography>
          </Box>
        )}

        {/* Posts Feed */}
        {getFilteredPosts().map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

      </Container>
    </Box>
  );
};

export default Feed;