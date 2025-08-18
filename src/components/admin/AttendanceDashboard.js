// src/components/admin/AttendanceDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
  TextField
} from '@mui/material';
import { 
  CheckCircle, 
  AccessTime, 
  Cancel, 
  EventAvailable,
  EventBusy
} from '@mui/icons-material';

const AttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch attendance data
  const fetchAttendanceData = async (date) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/attendance?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setAttendanceData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance summary
  const fetchAttendanceSummary = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/attendance/summary`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSummary(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    fetchAttendanceData(event.target.value);
  };

  useEffect(() => {
    fetchAttendanceData(selectedDate);
    fetchAttendanceSummary();
  }, [selectedDate]);

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

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Attendance Dashboard</Typography>
        <TextField
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      {/* Summary Cards */}
      {summary && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 150, flexGrow: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventAvailable sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{summary.present + summary.late}</Typography>
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
              <EventBusy sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4">{summary.absent}</Typography>
              <Typography variant="body2" color="text.secondary">Absent</Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 150, flexGrow: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">{summary.attendanceRate}%</Typography>
              <Typography variant="body2" color="text.secondary">Attendance Rate</Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Attendance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Attendance for {new Date(selectedDate).toLocaleDateString()}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Shift Time</TableCell>
                    <TableCell>Check-In</TableCell>
                    <TableCell>Check-Out</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((record) => (
                    <TableRow 
                      key={record.employeeId} 
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        bgcolor: record.status === 'absent' ? 'error.light' : 'inherit'
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {record.name}
                      </TableCell>
                      <TableCell>{record.position}</TableCell>
                      <TableCell>
                        {record.shiftStart} - {record.shiftEnd}
                      </TableCell>
                      <TableCell>
                        {formatTime(record.checkInTime)}
                      </TableCell>
                      <TableCell>
                        {formatTime(record.checkOutTime)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(record.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceDashboard;