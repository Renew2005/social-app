import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography,
  Paper, Alert, CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) {
      return setError('All fields are required');
    }
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/api/auth/login', form
      );
      login(res.data.user, res.data.token);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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

        <Typography variant="h4" fontWeight="bold" color="primary" textAlign="center" mb={1}>
          Social App
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
          Welcome back!
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

        <Button
          fullWidth variant="contained" size="large"
          onClick={handleLogin} disabled={loading}
          sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>

        <Typography textAlign="center" mt={2} variant="body2">
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#1976d2', fontWeight: 'bold' }}>
            Sign Up
          </Link>
        </Typography>

      </Paper>
    </Box>
  );
};

export default Login;