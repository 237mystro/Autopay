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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Payment, Download } from '@mui/icons-material';

const PayrollProcessing = () => {
  const [open, setOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  
  const payrolls = [
    { id: 1, period: 'May 2025', employees: 42, totalAmount: 2150000, status: 'processed' },
    { id: 2, period: 'April 2025', employees: 40, totalAmount: 2050000, status: 'paid' },
    { id: 3, period: 'March 2025', employees: 38, totalAmount: 1980000, status: 'paid' },
  ];
  
  const payrollDetails = [
    { employee: 'John Smith', position: 'Cashier', shifts: 22, amount: 110000 },
    { employee: 'Sarah Johnson', position: 'Supervisor', shifts: 26, amount: 182000 },
    { employee: 'Michael Brown', position: 'Manager', shifts: 20, amount: 200000 },
    { employee: 'Emily Davis', position: 'Clerk', shifts: 20, amount: 90000 },
  ];

  const handleClickOpen = (payroll) => {
    setSelectedPayroll(payroll);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApprove = () => {
    // Logic to approve payment
    handleClose();
  };

  return (
    <div>
      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs>
          <Typography variant="h4">Payroll Processing</Typography>
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            startIcon={<Payment />} >
            Generate Payroll
          </Button>
        </Grid>
      </Grid>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Payrolls
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell>Employees</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>{payroll.period}</TableCell>
                    <TableCell>{payroll.employees}</TableCell>
                    <TableCell>{payroll.totalAmount.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <Chip 
                        label={payroll.status} 
                        color={payroll.status === 'paid' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        onClick={() => handleClickOpen(payroll)}
                        sx={{ mr: 1 }}
                      >
                        Review
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<Download />}
                      >
                        Payslip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Methods
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  MTN Mobile Money
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Send payments directly to employee MTN accounts
                </Typography>
                <Button variant="contained" color="primary">
                  Connect MTN Account
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" color="secondary" gutterBottom>
                  Orange Money
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Send payments directly to employee Orange accounts
                </Typography>
                <Button variant="contained" color="secondary">
                  Connect Orange Account
                </Button>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Payroll Details - {selectedPayroll?.period}
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Shifts</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrollDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{detail.employee}</TableCell>
                    <TableCell>{detail.position}</TableCell>
                    <TableCell>{detail.shifts}</TableCell>
                    <TableCell>{detail.amount.toLocaleString()} FCFA</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Total Employees: 42</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">Total Amount: 2,150,000 FCFA</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleApprove} variant="contained" color="primary">
            Approve Payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PayrollProcessing;