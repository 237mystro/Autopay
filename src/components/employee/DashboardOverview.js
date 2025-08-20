// src/components/employee/DashboardOverview.js
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
  Divider,
} from '@mui/material';
import {
  Payment,
  Warning,
  CheckCircle,
  Info,
  Link as LinkIcon,
} from '@mui/icons-material';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({});
  const [todaysShift, setTodaysShift] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        setEmployeeData({
          name: user.name,
          email: user.email,
          position: user.position || "Employee",
          company: user.company || "Company",
          phone: '+237 678901234',
          momoNumber: '+237 678901234',
          salary: 250000,
          payPerShift: 5000,
          department: 'Sales',
          startDate: '2023-01-15'
        });

        setTodaysShift({
          date: new Date().toLocaleDateString(),
          startTime: '08:00 AM',
          endTime: '04:00 PM',
          location: 'Main Office (47WP+W6J)',
          status: 'scheduled'
        });

        setRecentPayments([
          { period: 'April 2023', amount: 215000, date: '2023-05-01', status: 'paid' },
          { period: 'March 2023', amount: 205000, date: '2023-04-03', status: 'paid' },
          { period: 'February 2023', amount: 198000, date: '2023-03-01', status: 'paid' }
        ]);

        setNotifications([
          { message: 'Your April payroll has been processed', severity: 'success', date: '2023-05-01' },
          { message: 'Remember to check in today', severity: 'info', date: new Date().toLocaleDateString() },
          { message: 'Update your profile information', severity: 'warning', date: '2023-04-28' }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'secondary.main', fontSize: 28 }}>
              {employeeData.name ? employeeData.name.charAt(0) : 'E'}
            </Avatar>
            <Box textAlign={{ xs: 'center', sm: 'left' }}>
              <Typography variant="h6">Welcome back, {employeeData.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {employeeData.position} • {employeeData.department} @ {employeeData.company}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Chip label={`Salary: ${employeeData.salary?.toLocaleString()} FCFA`} size="small" />
                <Chip label={`Pay/Shift: ${employeeData.payPerShift?.toLocaleString()} FCFA`} size="small" />
                <Chip label={`Start: ${new Date(employeeData.startDate).toLocaleDateString()}`} size="small" />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>Employee Dashboard</Typography>

      {/* Shifts & Payments */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Today's Shift</Typography>
              {todaysShift ? (
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                    <Typography variant="body1">{todaysShift.date}</Typography>
                    <Typography variant="body2" color="text.secondary">{todaysShift.startTime} - {todaysShift.endTime}</Typography>
                  </Box>
                  <Chip 
                    label={todaysShift.status}
                    color={todaysShift.status === 'scheduled' ? 'primary' :
                           todaysShift.status === 'in-progress' ? 'warning' : 'success'} 
                    sx={{ mb: 2 }}
                  />
                  <Button fullWidth variant="contained">
                    {todaysShift.status === 'scheduled' ? 'Check In' :
                     todaysShift.status === 'in-progress' ? 'Check Out' : 'Completed'}
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No shift scheduled for today</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Payments</Typography>
              <List>
                {recentPayments.map((payment, i) => (
                  <ListItem key={i} divider>
                    <ListItemAvatar><Avatar><Payment /></Avatar></ListItemAvatar>
                    <ListItemText primary={`${payment.period}`} secondary={`Paid on ${payment.date}`} />
                    <Typography fontWeight={600}>{payment.amount.toLocaleString()} FCFA</Typography>
                  </ListItem>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>View All</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notifications & Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              {notifications.map((n, i) => (
                <ListItem key={i} divider>
                  <ListItemAvatar>
                    {n.severity === 'warning' ? <Warning color="warning" /> :
                     n.severity === 'success' ? <CheckCircle color="success" /> : <Info color="info" />}
                  </ListItemAvatar>
                  <ListItemText primary={n.message} secondary={n.date} />
                  <Button size="small"><LinkIcon fontSize="small" /></Button>
                </ListItem>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button fullWidth variant="contained">Check In</Button>
                <Button fullWidth variant="outlined">View Schedule</Button>
                <Button fullWidth variant="outlined">Payment History</Button>
                <Button fullWidth variant="outlined">Edit Profile</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
