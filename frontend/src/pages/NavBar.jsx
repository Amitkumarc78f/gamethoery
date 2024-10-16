import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, colors } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Logo or Home Link */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          Home
        </Typography>

        {/* Sign Up Link */}
        <Button 
          component={Link} 
          to="/signup" 
          color="inherit" 
          sx={{ textDecoration: 'none' }}
        >
          Sign Up
        </Button>

        {/* Sign In Link */}
        <Button 
          component={Link} 
          to="/signin" 
          color="inherit" 
          sx={{ textDecoration: 'none' }}
        >
          Sign In
        </Button>
      </Toolbar>
    </AppBar>
  );
};
