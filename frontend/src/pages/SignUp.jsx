import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { TextField, MenuItem, Button, Select, InputLabel, FormControl, Box, Paper, Typography } from '@mui/material';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    role: 'user',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form Data Submitted:', formData);
    const apiurl = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await fetch(`${apiurl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: data.name,
            email: data.email,
            role: data.role,
          })
        );

        if (data.role === 'admin') {
          navigate('/admin/showallbookings');
        } else {
          navigate('/user/userbookings');
        }
      }
    } catch (err) {
      setError('An error occurred while signing up. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center bg-gray-100 p-6 w-screen">
      <NavBar />

      {/* Sign Up Form */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          width: '500px',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            maxWidth: 400,
            width: '100%',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Name Field */}
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} variant="outlined" fullWidth />

           
            {/* Password Field */}
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} variant="outlined" fullWidth />

            {/* Email Field */}
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} variant="outlined" fullWidth />

            {/* Error Display */}
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}
