import React from 'react';
import {
  AppBar, Toolbar, Typography,
  Button, Avatar, Box
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        {/* App Title */}
        <Typography variant="h6" fontWeight="bold">
          🌐 Social
        </Typography>

        {/* Right side — username + logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff', color: '#1976d2', fontSize: 14 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            @{user?.username}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleLogout}
            sx={{ color: '#fff', borderColor: '#fff', ml: 1 }}
          >
            Logout
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;