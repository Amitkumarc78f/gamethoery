import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from './user/Header';
import NavBar from './NavBar';
import { TextField, Button, Box, Tabs, Tab, Paper } from '@mui/material';

function SignIn() {
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    // State to manage form data for both tabs (User/Admin)
    const [formData, setFormData] = useState({
      user: { email: '', password: '' },
      admin: { email: '', password: '' },
    });
  
    // Handle tab change
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
  
    // Handle form changes for both User and Admin
    const handleChange = (event) => {
      const { name, value } = event.target;
      const role = tabValue === 0 ? 'user' : 'admin'; // Determine the role based on active tab
      setFormData((prevData) => ({
        ...prevData,
        [role]: {
          ...prevData[role],
          [name]: value,
        },
      }));
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
      const role = tabValue === 0 ? 'user' : 'admin';
      console.log(`Form Data for ${role}:`, formData[role]);

    try {
      setLoading(true);
      const apiurl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(apiurl + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData[role],
          role, // Pass the role ('admin' or 'user') as part of the request
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
        // Save token and user details in localStorage
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          name: data.name,
          email: data.email,
          role: data.role,
        }));

        // Redirect based on role
        if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/userbookings');
        }
      }

      setLoading(false);
    } catch (err) {
      setError('An error occurred while logging in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center bg-gray-100 p-6 w-screen">
      <NavBar />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', width:'500px' }}>
            <Paper 
                elevation={4} 
                sx={{ 
                padding: 4, 
                maxWidth: 400, 
                width: '100%', 
                backgroundColor: '#fff', 
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', 
                borderRadius: '8px' 
                }}
            >
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="User" />
                <Tab label="Admin" />
                </Tabs>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                {/* Email Field */}
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={tabValue === 0 ? formData.user.email : formData.admin.email}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                />

                {/* Password Field */}
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={tabValue === 0 ? formData.user.password : formData.admin.password}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                />

                {/* Submit Button */}
                <Button type="submit" variant="contained" color="primary">
                    Sign in
                </Button>
                </Box>
            </Paper>
        </Box>
    </div>
  );
}

export default SignIn;
