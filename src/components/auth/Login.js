// src/components/auth/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  FormControlLabel, 
  Checkbox, 
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Use the API URL from environment variables
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });
      
      console.log('Response status:', response.status);
      
      // Check if response has content
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Handle empty response
      if (!responseText) {
        throw new Error('Empty response from server');
      }
      
      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }
      
      console.log('Parsed response:', data);
      
      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on user role
        if (data.user.role === 'employee') {
          navigate('/employee/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      if (err instanceof TypeError) {
        if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          setError('Cannot connect to server. Please make sure the backend is running.');
        } else {
          setError('Network error: ' + err.message);
        }
      } else if (err.message.includes('JSON')) {
        setError('Invalid response from server. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
          Sign in to AutoPayroll
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox 
                value="remember" 
                color="primary" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Divider sx={{ my: 2 }}>or</Divider>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                New Business? Create Account
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;