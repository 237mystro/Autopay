import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';

const Schedule = () => {
  const scheduleData = [
    { day: 'Monday', date: 'May 15', shifts: [{ start: '08:00 AM', end: '04:00 PM', position: 'Cashier' }] },
    { day: 'Tuesday', date: 'May 16', shifts: [{ start: '08:00 AM', end: '04:00 PM', position: 'Cashier' }] },
    { day: 'Wednesday', date: 'May 17', shifts: [{ start: '08:00 AM', end: '04:00 PM', position: 'Cashier' }] },
    { day: 'Thursday', date: 'May 18', shifts: [{ start: '08:00 AM', end: '04:00 PM', position: 'Cashier' }] },
    { day: 'Friday', date: 'May 19', shifts: [{ start: '08:00 AM', end: '04:00 PM', position: 'Cashier' }] },
    { day: 'Saturday', date: 'May 20', shifts: [{ start: '09:00 AM', end: '05:00 PM', position: 'Cashier' }] },
    { day: 'Sunday', date: 'May 21', shifts: [] },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Schedule
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h5">Weekly Schedule</Typography>
              <Typography variant="body2" color="text.secondary">
                July 15 - August 21, 2025
              </Typography>
            </Box>
          </Box>
          
          {scheduleData.map((day, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                py: 2, 
                borderBottom: index < scheduleData.length - 1 ? '1px solid #eee' : 'none'
              }}
            >
              <Box sx={{ width: 100, mr: 2 }}>
                <Typography variant="body1" fontWeight="bold">{day.day}</Typography>
                <Typography variant="body2" color="text.secondary">{day.date}</Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                {day.shifts.length > 0 ? (
                  day.shifts.map((shift, shiftIndex) => (
                    <Box key={shiftIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: 150 }}>
                        <Typography variant="body2">
                          {shift.start} - {shift.end}
                        </Typography>
                      </Box>
                      <Chip 
                        label={shift.position} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No shifts scheduled
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;