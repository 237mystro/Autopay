// src/components/admin/AttendanceDashboard.js (updated)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People,
  Schedule,
  AccessTime,
  CheckCircle,
  Warning,
  Cancel
} from '@mui/icons-material';

const AttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/attendance/admin-dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAttendanceData(data.data.attendance);
        setSummary({
          totalEmployees: data.data.totalEmployees,
          present: data.data.present,
          late: data.data.late,
          absent: data.data.absent
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch attendance data');
      console.error('Fetch attendance error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status chip
  const getStatusChip = (status) => {
    switch (status) {
      case 'present':
        return <Chip icon={<CheckCircle />} label="Present" color="success" size="small" />;
      case 'late':
        return <Chip icon={<AccessTime />} label="Late" color="warning" size="small" />;
      case 'absent':
        return <Chip icon={<Cancel />} label="Absent" color="error" size="small" />;
      default:
        return <Chip label={status} variant="outlined" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Attendance Dashboard
      </Typography>
      
      {summary && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 150, flexGrow: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{summary.totalEmployees}</Typography>
              <Typography variant="body2" color="text.secondary">Total Employees</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 150, flexGrow: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{summary.present}</Typography>
              <Typography variant="body2" color="text.secondary">Present</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 150, flexGrow: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTime sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{summary.late}</Typography>
              <Typography variant="body2" color="text.secondary">Late</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 150, flexGrow: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Cancel sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4">{summary.absent}</Typography>
              <Typography variant="body2" color="text.secondary">Absent</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Attendance
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Check-In Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.employeeId?.name || 'Unknown'}</TableCell>
                    <TableCell>{record.employeeId?.position || 'Unknown'}</TableCell>
                    <TableCell>
                      {record.checkInTime 
                        ? new Date(record.checkInTime).toLocaleTimeString() 
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(record.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendanceDashboard;