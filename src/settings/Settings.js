// src/components/settings/Settings.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  Language,
  Person,
  Key,
  Save
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    preferences: {
      theme: 'light',
      language: 'en'
    },
    security: {
      twoFactorAuth: false
    }
  });
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    momoNumber: '',
    position: ''
  });
  
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch current settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        setError(data.message || 'Failed to fetch settings');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current profile
  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        momoNumber: user.momoNumber || '',
        position: user.position || ''
      });
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Fetch profile error:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchProfile();
  }, []);

  // Handle notification settings change
  const handleNotificationChange = (field) => (event) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: event.target.checked
      }
    });
  };

  // Handle preference settings change
  const handlePreferenceChange = (field) => (event) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [field]: event.target.value
      }
    });
  };

  // Handle profile change
  const handleProfileChange = (field) => (event) => {
    setProfile({
      ...profile,
      [field]: event.target.value
    });
  };

  // Handle password change
  const handlePasswordChange = (field) => (event) => {
    setPassword({
      ...password,
      [field]: event.target.value
    });
  };

  // Save settings
  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Settings saved successfully');
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user')) || {};
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setError(data.message || 'Failed to save settings');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Save settings error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Save profile
  const saveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/settings/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Profile updated successfully');
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Validate passwords
      if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
        setError('Please fill in all password fields');
        setSaving(false);
        return;
      }
      
      if (password.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        setSaving(false);
        return;
      }
      
      if (password.newPassword !== password.confirmPassword) {
        setError('New passwords do not match');
        setSaving(false);
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/settings/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Password changed successfully');
        setPassword({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Change password error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Profile Information
              </Typography>
              
              <TextField
                fullWidth
                label="Full Name"
                value={profile.name}
                onChange={handleProfileChange('name')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Email Address"
                value={profile.email}
                onChange={handleProfileChange('email')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                value={profile.phone}
                onChange={handleProfileChange('phone')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Mobile Money Number"
                value={profile.momoNumber}
                onChange={handleProfileChange('momoNumber')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Position"
                value={profile.position}
                onChange={handleProfileChange('position')}
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />} 
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                Notification Preferences
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive important updates via email" 
                  />
                  <Switch
                    checked={settings.notifications.email}
                    onChange={handleNotificationChange('email')}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText 
                    primary="SMS Notifications" 
                    secondary="Receive alerts via SMS" 
                  />
                  <Switch
                    checked={settings.notifications.sms}
                    onChange={handleNotificationChange('sms')}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Push Notifications" 
                    secondary="Receive notifications on your device" 
                  />
                  <Switch
                    checked={settings.notifications.push}
                    onChange={handleNotificationChange('push')}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                <Palette sx={{ mr: 1, verticalAlign: 'middle' }} />
                Appearance
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="theme-label">Theme</InputLabel>
                <Select
                  labelId="theme-label"
                  value={settings.preferences.theme}
                  label="Theme"
                  onChange={handlePreferenceChange('theme')}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                  labelId="language-label"
                  value={settings.preferences.language}
                  label="Language"
                  onChange={handlePreferenceChange('language')}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                startIcon={<Save />} 
                onClick={saveSettings}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                Security
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Two-Factor Authentication" 
                    secondary="Add an extra layer of security to your account" 
                  />
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        twoFactorAuth: e.target.checked
                      }
                    })}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                <Key sx={{ mr: 1, verticalAlign: 'middle' }} />
                Change Password
              </Typography>
              
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={password.currentPassword}
                onChange={handlePasswordChange('currentPassword')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={password.newPassword}
                onChange={handlePasswordChange('newPassword')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={password.confirmPassword}
                onChange={handlePasswordChange('confirmPassword')}
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Save />} 
                onClick={changePassword}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;