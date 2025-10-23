// src/components/profile/Profile.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  Payment,
  Edit
} from '@mui/icons-material';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    setUser(userData);
    
    // In a real app, you would fetch employee data from the API
 if (userData.role === 'employee') {
    // Use mock employee data (or fetch from API)
    const employeeData = {
      employeeId: "EMP1755479504390",
      name: "employee 1",
      email: "employee@gmail.com",
      phone: "654917354",
      momoNumber: "654819737",
      position: "intern",
      department: "kitchen",
      salary: 100000,
      payPerShift: 1500,
      status: "active",
      startDate: 1755479504393
    };
    setEmployee(employeeData);
  } else {
    // For admin/HR, use user data for employee fields
    setEmployee({
      employeeId: userData.employeeId || 'Admin',
      name: userData.name || 'Admin User',
      email: userData.email || '',
      phone: userData.phone || '',
      momoNumber: userData.momoNumber || '',
      position: userData.position || userData.role || 'Administrator',
      department: userData.department || userData.company || 'Administrator',
      salary: userData.salary || 0,
      payPerShift: userData.payPerShift || 0,
      status: userData.status || 'active',
      startDate: userData.startDate || Date.now()
    });
  } 
  }, []);

  if (!user || !employee) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2, 
                  bgcolor: 'primary.main' 
                }}
              >
                {user.name ? user.name.charAt(0) : 'U'}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {user.position} • {user.company}
              </Typography>
              
              <Chip 
                label={user.role === 'admin' ? 'Administrator' : 
                       user.role === 'hr' ? 'HR Manager' : 
                       'Employee'} 
                color={user.role === 'admin' ? 'primary' : 
                       user.role === 'hr' ? 'secondary' : 
                       'default'} 
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                fullWidth
                component="a"
                href="/settings"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={user.name} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Address" 
                    secondary={user.email} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone Number" 
                    secondary={employee.phone} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Payment />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mobile Money Number" 
                    secondary={employee.momoNumber} 
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Employment Information
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Employee ID" 
                    secondary={employee.employeeId || 'Admin'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Position" 
                    secondary={employee.position || 'Administrator'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Department" 
                    secondary={employee.department || 'Administrator'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Payment />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Monthly Salary" 
                    secondary={`${employee.salary.toLocaleString()} FCFA` || 'Boss'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Payment />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Pay per Shift" 
                    secondary={`${employee.payPerShift.toLocaleString()} FCFA` || 'Boss'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Start Date" 
                    secondary={new Date(employee.startDate).toLocaleDateString() || 'Boss'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Employment Status" 
                    secondary={
                      <Chip 
                        label={employee.status} 
                        color={employee.status === 'active' ? 'success' : 'default'} 
                        size="small" 
                      />
                    } 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;