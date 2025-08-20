// src/components/auth/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container,  Typography,  TextField,  Button,  Box,  Paper,  FormControlLabel,  Checkbox,   Alert,  CircularProgress} from '@mui/material';

const Register = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation
    if (!name || !company || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Make API call to backend
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          company,
          email,
          password
        })
      });
      
      const data = await response.json();
      console.log('Registration response:', data); // Debug log
      
      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check your connection and try again.');
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
          Register Your Business
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Create an account for your small business
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Your Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error && !name}
            helperText={!!error && !name ? 'Name is required' : ''}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="company"
            label="Business Name"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            error={!!error && !company}
            helperText={!!error && !company ? 'Business name is required' : ''}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Business Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && (!email || !/\S+@\S+\.\S+/.test(email))}
            helperText={
              !!error && !email ? 'Email is required' : 
              !!error && !/\S+@\S+\.\S+/.test(email) ? 'Please enter a valid email' : ''
            }
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error && (!password || password.length < 6)}
            helperText={
              !!error && !password ? 'Password is required' : 
              !!error && password.length < 6 ? 'Password must be at least 6 characters' : ''
            }
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error && (password !== confirmPassword)}
            helperText={!!error && password !== confirmPassword ? 'Passwords do not match' : ''}
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                color="primary" 
                required
              />
            }
            label={
              <Typography variant="body2">
                I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>
              </Typography>
            }
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Business Account'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Already have an account? Sign In
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;