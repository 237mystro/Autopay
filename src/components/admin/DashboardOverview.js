import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button
} from '@mui/material';
import {
  People,
  Schedule,
  Payment,
  Assignment,
  TrendingUp,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import QRCodeDisplay from './QRCodeDisplay';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardOverview = () => {
  // Mock data
  const metrics = [
    { title: 'Active Employees', value: 42, icon: <People />, color: '#1976d2' },
    { title: "Today's Shifts", value: 38, icon: <Schedule />, color: '#388e3c' },
    { title: 'Payments Sent', value: 32, icon: <Payment />, color: '#f57c00' },
    { title: 'Attendance Rate', value: '92%', icon: <Assignment />, color: '#7b1fa2' }
  ];

  const attendanceData = [
    { name: 'Mon', present: 38, absent: 4 },
    { name: 'Tue', present: 40, absent: 2 },
    { name: 'Wed', present: 39, absent: 3 },
    { name: 'Thu', present: 41, absent: 1 },
    { name: 'Fri', present: 37, absent: 5 },
    { name: 'Sat', present: 25, absent: 0 },
    { name: 'Sun', present: 18, absent: 0 }
  ];

  const recentAttendance = [
    { name: 'John Smith', time: '08:45 AM', status: 'on-time' },
    { name: 'Sarah Johnson', time: '08:52 AM', status: 'late' },
    { name: 'Michael Brown', time: '09:15 AM', status: 'late' },
    { name: 'Emily Davis', time: '08:30 AM', status: 'on-time' },
    { name: 'David Wilson', time: '-', status: 'absent' }
  ];

  const alerts = [
    { message: 'Sarah Johnson missed check-in', severity: 'warning' },
    { message: 'Payroll processing due in 3 days', severity: 'info' },
    { message: 'New employee onboarding required', severity: 'info' }
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: metric.color, mr: 2 }}>
                    {metric.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{metric.value}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Attendance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#388e3c" name="Present" />
                    <Bar dataKey="absent" fill="#d32f2f" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Attendance
              </Typography>
              <List>
                {recentAttendance.map((person, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemAvatar>
                      <Avatar>
                        {person.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={person.name} 
                      secondary={person.time} 
                    />
                    <Chip 
                      label={person.status} 
                      color={person.status === 'on-time' ? 'success' : person.status === 'late' ? 'warning' : 'error'} 
                      size="small" 
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid container spacing={3}>
  <Grid item xs={12} md={8}>
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Alerts
        </Typography>
        <List>
          {alerts.map((alert, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                {alert.severity === 'warning' ? (
                  <Warning color="warning" />
                ) : (
                  <CheckCircle color="info" />
                )}
              </ListItemAvatar>
              <ListItemText primary={alert.message} />
              <Button size="small">View</Button>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  </Grid>
  
  <Grid item xs={12} md={4}>
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Office Locations
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => {/* Navigate to locations page */}}
          >
            Manage Locations
          </Button>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => {/* Generate QR for main office */}}
          >
            Main Office QR
          </Button>
        </Box>
      </CardContent>
    </Card>
    
    <QRCodeDisplay 
      shiftId="demo-shift-id" 
      locationName="Main Office" 
    />
  </Grid>
</Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" fullWidth>
                  Generate Payroll
                </Button>
                <Button variant="outlined" fullWidth>
                  Schedule Shifts
                </Button>
                <Button variant="outlined" fullWidth>
                  Send Messages
                </Button>
                <Button variant="outlined" fullWidth>
                  View Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardOverview;