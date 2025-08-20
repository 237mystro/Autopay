// src/components/admin/DashboardOverview.js
import React, { useState, useEffect } from 'react';
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
  Button,
  CircularProgress,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import {
  People,
  Schedule,
  Payment,
  Assignment,
  TrendingUp,
  Warning,
  CheckCircle,
  Info,
  Link as LinkIcon,
  LocationOn,
  QrCode
} from '@mui/icons-material';
import QRCodeDisplay from './QRCodeDisplay';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeEmployees: 0,
    todaysShifts: 0,
    paymentsSent: 0,
    attendanceRate: '0%'
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Mock data - in a real app, this would come from your API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock metrics data
        setMetrics({
          activeEmployees: 42,
          todaysShifts: 38,
          paymentsSent: 32,
          attendanceRate: '92%'
        });
        
        // Mock recent attendance data
        setRecentAttendance([
          { name: 'John Smith', time: '08:45 AM', status: 'on-time' },
          { name: 'Sarah Johnson', time: '08:52 AM', status: 'late' },
          { name: 'Michael Brown', time: '09:15 AM', status: 'late' },
          { name: 'Emily Davis', time: '08:30 AM', status: 'on-time' },
          { name: 'David Wilson', time: '-', status: 'absent' }
        ]);
        
        // Mock alerts data
        setAlerts([
          { message: 'Sarah Johnson missed check-in', severity: 'warning' },
          { message: 'Payroll processing due in 3 days', severity: 'info' },
          { message: 'New employee onboarding required', severity: 'info' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const metricsData = [
    { title: 'Active Employees', value: metrics.activeEmployees, icon: <People />, color: '#1976d2' },
    { title: "Today's Shifts", value: metrics.todaysShifts, icon: <Schedule />, color: '#388e3c' },
    { title: 'Payments Sent', value: metrics.paymentsSent, icon: <Payment />, color: '#f57c00' },
    { title: 'Attendance Rate', value: metrics.attendanceRate, icon: <Assignment />, color: '#7b1fa2' }
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

  const pieData = [
    { name: 'Present', value: 75, color: '#4caf50' },
    { name: 'Late', value: 10, color: '#ff9800' },
    { name: 'Absent', value: 15, color: '#f44336' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      {/* User Profile Header */}
      <Card sx={{ mb: { xs: 2, md: 3 }, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Avatar sx={{ width: 64, height: 64, mr: { sm: 2 }, mb: { xs: 1, sm: 0 }, bgcolor: 'primary.main' }}>
              {user.name ? user.name.charAt(0) : 'A'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
                Welcome back, {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {user.position} at {user.company}
              </Typography>
              <Chip 
                label={user.role === 'admin' ? 'Administrator' : 'HR Manager'} 
                color="primary" 
                size="small" 
              />
            </Box>
            <Box sx={{ mt: { xs: 2, sm: 0 } }}>
              <Button 
                variant="outlined" 
                startIcon={<LocationOn />}
                sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}
              >
                Office Locations
              </Button>
              <Button 
                variant="contained" 
                startIcon={<QrCode />}
              >
                Generate QR
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Typography variant="h4" gutterBottom sx={{ mb: { xs: 2, md: 3 } }}>
        Dashboard Overview
      </Typography>
      
      {/* Metrics Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
        {metricsData.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', boxShadow: 2, transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: metric.color, mr: 2 }}>
                    {metric.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{metric.value}</Typography>
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
      
      {/* Charts Section */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Weekly Attendance
              </Typography>
              <Box sx={{ height: { xs: 250, md: 300 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
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
        
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Attendance Distribution
              </Typography>
              <Box sx={{ height: { xs: 250, md: 300 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Alerts and Quick Actions */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Recent Alerts
              </Typography>
              <List>
                {alerts.map((alert, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      py: 1, 
                      borderBottom: index < alerts.length - 1 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none' 
                    }}
                  >
                    <ListItemAvatar>
                      {alert.severity === 'warning' ? (
                        <Warning color="warning" />
                      ) : (
                        <Info color="info" />
                      )}
                    </ListItemAvatar>
                    <ListItemText primary={alert.message} />
                    <Button size="small" variant="outlined">View</Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
            
            <Grid item xs={12}>
              <Card sx={{ height: '100%', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Office QR Code
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <QRCodeDisplay 
                      shiftId="demo-shift-id" 
                      locationName="Main Office" 
                    />
                  </Box>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    startIcon={<QrCode />}
                  >
                    Download QR
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;