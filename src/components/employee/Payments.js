import React from 'react';
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
  Chip,
  Button
} from '@mui/material';
import { Download } from '@mui/icons-material';

const Payments = () => {
  const paymentHistory = [
    { id: 1, period: 'April 2025', date: '2023-05-01', amount: 185000, status: 'paid' },
    { id: 2, period: 'March 2025', date: '2023-04-03', amount: 192000, status: 'paid' },
    { id: 3, period: 'February 2025', date: '2023-03-01', amount: 178000, status: 'paid' },
    { id: 4, period: 'January 2025', date: '2023-02-01', amount: 185000, status: 'paid' },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Payments
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.period}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.amount.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.status} 
                        color="success" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
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
    </div>
  );
};

export default Payments;