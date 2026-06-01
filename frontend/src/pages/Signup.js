import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography,
  Paper, Alert, CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [form, setForm] = useState({
    username: '', email: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError('');

    // Basic validation
    if (!form.username || !form.email || !form.password) {
      return setError('All fields are required');
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'https://social-app-backend-e8b5.onrender.com/api/auth/signup', form
      );
      // Save user and token globally
      login(res.data.user, res.data.token);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
    }}>
      <Paper elevation={6} sx={{ padding: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>

        {/* Header */}
        <Typography variant="h4" fontWeight="bold" color="primary" textAlign="center" mb={1}>
          Social App
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
          Create your account
        </Typography>

        {/* Error message */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Form Fields */}
        <TextField
          fullWidth label="Username" name="username"
          value={form.username} onChange={handleChange}
          sx={{ mb: 2 }} variant="outlined"
        />
        <TextField
          fullWidth label="Email" name="email" type="email"
          value={form.email} onChange={handleChange}
          sx={{ mb: 2 }} variant="outlined"
        />
        <TextField
          fullWidth label="Password" name="password" type="password"
          value={form.password} onChange={handleChange}
          sx={{ mb: 3 }} variant="outlined"
        />

        {/* Signup Button */}
        <Button
          fullWidth variant="contained" size="large"
          onClick={handleSignup} disabled={loading}
          sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
        </Button>

        {/* Link to Login */}
        <Typography textAlign="center" mt={2} variant="body2">
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1976d2', fontWeight: 'bold' }}>
            Login
          </Link>
        </Typography>

      </Paper>
    </Box>
  );
};

export default Signup;