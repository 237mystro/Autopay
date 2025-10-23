import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Typography, Card, CardContent, Box } from '@mui/material';
import { QrCode, AutoGraph, Payment, Schedule, People, Security } from '@mui/icons-material';

const LandingPage = () => {
  const features = [
    { icon: <QrCode sx={{ fontSize: 40, color: '#1976d2' }} />, title: 'QR Attendance', description: 'Scan QR codes to clock in/out with location validation' },
    { icon: <AutoGraph sx={{ fontSize: 40, color: '#388e3c' }} />, title: 'Payroll Automation', description: 'Automatic calculation based on attendance and shift data' },
    { icon: <Payment sx={{ fontSize: 40, color: '#f57c00' }} />, title: 'Mobile Money Integration', description: 'Seamless payments via MTN and Orange Money' },
    { icon: <Schedule sx={{ fontSize: 40, color: '#7b1fa2' }} />, title: 'Shift Scheduling', description: 'Plan and manage employee shifts efficiently' },
    { icon: <People sx={{ fontSize: 40, color: '#0288d1' }} />, title: 'Employee Management', description: 'Centralized employee database with detailed profiles' },
    { icon: <Security sx={{ fontSize: 40, color: '#d32f2f' }} />, title: 'Secure & Reliable', description: 'Enterprise-grade security for your payroll data' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid  
            container 
            spacing={4} 
            alignItems="center" 
            justifyContent="center"
          >
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                AutoPayroll
              </Typography>
              <Typography variant="h5" gutterBottom>
                Automated Payroll Management for Small & Medium Businesses
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Simplify payroll processing, track attendance with QR codes, and make instant payments via MTN and Orange Money.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
                <Button 
                  component={Link} 
                  to="/register" 
                  variant="contained" 
                  size="large" 
                  sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                >
                  Get Started
                </Button>
                <Button 
                  component={Link} 
                  to="/login" 
                  variant="outlined" 
                  size="large" 
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box 
                sx={{ 
                  height: 300, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '100%',
                  maxWidth: 400
                }}
              >
                <Typography variant="h4" align="center">Payroll Dashboard Preview</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
          Powerful Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, textAlign: 'center', boxShadow: 3 }}>
                <CardContent>
                  {feature.icon}
                  <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Simplify Your Payroll?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of businesses using AutoPayroll to automate their payroll processes.
          </Typography>
          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            size="large" 
            sx={{ 
              bgcolor: 'secondary.main', 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              '&:hover': { bgcolor: 'secondary.dark' } 
            }}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default LandingPage;
