// src/components/employee/QRScanner.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import {
  QrCodeScanner,
  LocationOn,
  Warning,
  CheckCircle,
  ErrorOutline,
  Schedule,
  AccessTime,
  Person,
  Close
} from '@mui/icons-material';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('pending'); // pending, verifying, verified, failed
  const [locationError, setLocationError] = useState('');
  const [qrData, setQrData] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState('idle'); // idle, processing, success, error
  const [verificationResult, setVerificationResult] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // Office location coordinates (Buea - 47WP+W6J)
  const OFFICE_LOCATION = {
    latitude: 4.1025,
    longitude: 9.3908
  };
  
  const MAX_DISTANCE = 20; // 20 meters

  // Get user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(userLocation);
        },
        (error) => {
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    });
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(coords1.latitude);
    const φ2 = toRad(coords2.latitude);
    const Δφ = toRad(coords2.latitude - coords1.latitude);
    const Δλ = toRad(coords2.longitude - coords1.longitude);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Verify if user is within allowed radius of office location
  const verifyLocation = async (userCoords) => {
    try {
      const distance = calculateDistance(userCoords, OFFICE_LOCATION);
      
      return {
        isWithinRadius: distance <= MAX_DISTANCE,
        distance: distance,
        maxDistance: MAX_DISTANCE,
        allowed: distance <= MAX_DISTANCE
      };
    } catch (error) {
      console.error('Location verification error:', error);
      throw new Error('Failed to verify location');
    }
  };

  // Format distance for display
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 100)} cm`;
    } else if (distance < 1000) {
      return `${Math.round(distance)} m`;
    } else {
      return `${(distance / 1000).toFixed(2)} km`;
    }
  };

  // Start scanning process
  const startScanning = async () => {
    try {
      setScanning(true);
      setLocation(null);
      setLocationStatus('pending');
      setLocationError('');
      setQrData(null);
      setCheckInStatus('idle');
      setOpenConfirmation(false);
      
      // Get user location
      setLocationStatus('verifying');
      const userLocation = await getUserLocation();
      setLocation(userLocation);
      
      // Verify location against office coordinates
      const result = await verifyLocation(userLocation);
      setVerificationResult(result);
      
      if (result.allowed) {
        setLocationStatus('verified');
      } else {
        setLocationStatus('failed');
        setLocationError(`You are ${formatDistance(result.distance)} away from the office. Maximum allowed distance is ${MAX_DISTANCE} meters.`);
        setScanning(false);
      }
    } catch (error) {
      setLocationStatus('failed');
      setLocationError(error.message);
      setScanning(false);
    }
  };

  // Handle QR scan result
  const handleScan = async (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setQrData(parsedData);
        setScanning(false);
        setOpenConfirmation(true);
      } catch (parseError) {
        console.error('QR Parse Error:', parseError);
        setCheckInStatus('error');
        setLocationError('Invalid QR code format');
        setScanning(false);
      }
    }
  };

  // Handle scan error
  const handleError = (err) => {
    console.error('QR Scan Error:', err);
    setScanning(false);
    setCheckInStatus('error');
    setLocationError('Camera error. Please try again.');
  };

  // Confirm and process check-in
  const confirmCheckIn = async () => {
    if (locationStatus !== 'verified') {
      setLocationError('Location verification required');
      return;
    }

    if (!qrData) {
      setLocationError('QR code is required');
      return;
    }

    try {
      setCheckInStatus('processing');
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Send check-in data to backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/attendance/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          qrData: JSON.stringify(qrData),
          userLocation: location
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCheckInStatus('success');
        setOpenConfirmation(false);
        
        // Redirect after success
        setTimeout(() => {
          navigate('/employee/dashboard');
        }, 2000);
      } else {
        throw new Error(data.message || 'Check-in failed');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      setCheckInStatus('error');
      setLocationError(error.message || 'Check-in failed. Please try again.');
    }
  };

  // Cancel scanning
  const cancelScanning = () => {
    setScanning(false);
    setLocation(null);
    setLocationStatus('pending');
    setLocationError('');
    setQrData(null);
    setCheckInStatus('idle');
    setOpenConfirmation(false);
  };

  // Reset scanner
  const resetScanner = () => {
    cancelScanning();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        QR Code Check-In
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn 
              color={locationStatus === 'verified' ? "success" : 
                     locationStatus === 'failed' ? "error" : 
                     locationStatus === 'verifying' ? "warning" : "disabled"} 
              sx={{ mr: 1 }} 
            />
            <Box>
              <Typography 
                variant="body1" 
                color={locationStatus === 'verified' ? "success.main" : 
                       locationStatus === 'failed' ? "error.main" : 
                       locationStatus === 'verifying' ? "warning.main" : "text.primary"}
              >
                {locationStatus === 'pending' && "Location verification required"}
                {locationStatus === 'verifying' && "Verifying your location..."}
                {locationStatus === 'verified' && `Location verified (${location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Unknown'})`}
                {locationStatus === 'failed' && "Location verification failed"}
              </Typography>
              {location && (
                <Typography variant="caption" color="text.secondary">
                  Accuracy: ±{Math.round(location.accuracy)} meters
                </Typography>
              )}
            </Box>
          </Box>
          
          {locationStatus === 'verifying' && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          {(locationStatus === 'failed' || locationError) && (
            <Alert severity={locationStatus === 'failed' ? "warning" : "error"} sx={{ mb: 2 }}>
              {locationError || "Location verification failed"}
              <Button 
                size="small" 
                onClick={startScanning} 
                sx={{ ml: 1 }}
              >
                Try Again
              </Button>
            </Alert>
          )}
          
          {verificationResult && locationStatus === 'failed' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Office Location:</strong> Buea (47WP+W6J)<br />
                <strong>Your Distance:</strong> {formatDistance(verificationResult.distance)}<br />
                <strong>Maximum Allowed:</strong> {verificationResult.maxDistance} meters
              </Typography>
            </Alert>
          )}
          
          <Box sx={{ textAlign: 'center', my: 3 }}>
            {!scanning ? (
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<QrCodeScanner />} 
                onClick={startScanning}
                disabled={locationStatus === 'verifying'}
                sx={{ py: 1.5, px: 4 }}
              >
                {locationStatus === 'verified' ? 'Scan QR Code' : 'Verify Location & Scan'}
              </Button>
            ) : (
              <Box>
                <Box sx={{ 
                  width: '100%', 
                  height: 300, 
                  border: '2px dashed #1976d2', 
                  borderRadius: 2, 
                  mb: 2, 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }}
                    onUserMediaError={handleError}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}>
                    <Box sx={{ 
                      width: 200, 
                      height: 200, 
                      border: '3px solid rgba(255, 255, 255, 0.8)',
                      borderRadius: 2
                    }} />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Point your camera at the QR code
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Close />}
                  onClick={cancelScanning}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* Check-In Success/Error Messages */}
      {checkInStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="h6">Check-In Successful!</Typography>
          <Typography>
            You have been successfully checked in at {new Date().toLocaleTimeString()}.
          </Typography>
        </Alert>
      )}
      
      {checkInStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Check-In Failed</Typography>
          <Typography>
            {locationError || 'Please try again or contact your administrator.'}
          </Typography>
        </Alert>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog open={openConfirmation} onClose={cancelScanning} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Check-In</DialogTitle>
        <DialogContent>
          {qrData && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Shift Details
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Employee" 
                    secondary={qrData.employeeName || 'Current Employee'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Schedule />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Date" 
                    secondary={qrData.date ? new Date(qrData.date).toLocaleDateString() : 'Unknown Date'} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Time" 
                    secondary={`${qrData.startTime || '00:00'} - ${qrData.endTime || '00:00'}`} 
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Location Verification
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography>
                  Your location has been verified within the allowed radius
                </Typography>
              </Box>
              
              {location && (
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Your Location:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}<br />
                    <strong>Accuracy:</strong> ±{Math.round(location.accuracy)} meters<br />
                    <strong>Status:</strong> Verified
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelScanning}>Cancel</Button>
          <Button 
            onClick={confirmCheckIn} 
            variant="contained" 
            color="primary"
            disabled={checkInStatus === 'processing'}
          >
            {checkInStatus === 'processing' ? 'Processing...' : 'Confirm Check-In'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRScanner;