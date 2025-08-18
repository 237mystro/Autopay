import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete, QrCode } from '@mui/icons-material';

const ShiftScheduling = () => {
  const [open, setOpen] = useState(false);
  const [shifts, setShifts] = useState([
    { id: 1, employee: 'John Smith', day: 'Monday', startTime: '08:00', endTime: '16:00' },
    { id: 2, employee: 'Sarah Johnson', day: 'Monday', startTime: '09:00', endTime: '17:00' },
    { id: 3, employee: 'Michael Brown', day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
    { id: 4, employee: 'Emily Davis', day: 'Wednesday', startTime: '10:00', endTime: '18:00' },
  ]);
  
  const [currentShift, setCurrentShift] = useState({
    id: null,
    employee: '',
    day: '',
    startTime: '',
    endTime: ''
  });

  const handleClickOpen = (shift = null) => {
    if (shift) {
      setCurrentShift(shift);
    } else {
      setCurrentShift({
        id: null,
        employee: '',
        day: '',
        startTime: '',
        endTime: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (currentShift.id) {
      // Edit existing shift
      setShifts(shifts.map(s => 
        s.id === currentShift.id ? currentShift : s
      ));
    } else {
      // Add new shift
      setShifts([
        ...shifts,
        { ...currentShift, id: shifts.length + 1 }
      ]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setShifts(shifts.filter(s => s.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentShift(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs>
          <Typography variant="h4">Shift Scheduling</Typography>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => handleClickOpen()}
          >
            Add Shift
          </Button>
        </Grid>
      </Grid>
      
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Day</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{shift.employee}</TableCell>
                    <TableCell>{shift.day}</TableCell>
                    <TableCell>{shift.startTime}</TableCell>
                    <TableCell>{shift.endTime}</TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => handleClickOpen(shift)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(shift.id)}
                      >
                        <Delete />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary"
                      >
                        <QrCode />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentShift.id ? 'Edit Shift' : 'Add New Shift'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employee"
                name="employee"
                value={currentShift.employee}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select
                  name="day"
                  value={currentShift.day}
                  label="Day"
                  onChange={handleChange}
                >
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                  <MenuItem value="Sunday">Sunday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                name="startTime"
                type="time"
                value={currentShift.startTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                name="endTime"
                type="time"
                value={currentShift.endTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {currentShift.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShiftScheduling;