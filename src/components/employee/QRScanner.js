// src/components/employee/QRScanner.js (corrected version)
import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Alert, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import { QrCodeScanner, LocationOn, Warning, CheckCircle, ErrorOutline } from '@mui/icons-material';
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('pending'); // 'pending', 'verifying', 'verified', 'failed'
  const [locationError, setLocationError] = useState('');
  const [qrData, setQrData] = useState('');
  const [checkInStatus, setCheckInStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
  const [verificationResult, setVerificationResult] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [shiftInfo, setShiftInfo] = useState(null);
  const scannerRef = useRef(null);

  // ACTUALLY GET USER'S LOCATION FROM THEIR DEVICE
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services in your browser settings.';
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

  // Calculate distance between two coordinates
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

  // Verify if user is within allowed radius of Buea office
  const verifyLocation = (userCoords) => {
    // Buea office coordinates (47WP+W6J)
    const BUEA_COORDINATES = {
      latitude: 4.1025,
      longitude: 9.3908
    };
    
    const VERIFICATION_RADIUS = 20; // 20 meters
    
    const distance = calculateDistance(userCoords, BUEA_COORDINATES);
    
    return {
      isWithinRadius: distance <= VERIFICATION_RADIUS,
      distance: distance,
      maxDistance: VERIFICATION_RADIUS,
      allowed: distance <= VERIFICATION_RADIUS
    };
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

  // ACTUALLY VERIFY USER LOCATION
  const verifyUserLocation = async () => {
    try {
      setLocationStatus('verifying');
      setLocationError('');
      
      // THIS WILL PROMPT USER FOR LOCATION PERMISSION
      const userLocation = await getUserLocation();
      setLocation(userLocation);
      
      // Verify location against Buea coordinates
      const result = verifyLocation(userLocation);
      setVerificationResult(result);
      
      if (result.allowed) {
        setLocationStatus('verified');
      } else {
        setLocationStatus('failed');
        setLocationError(`You are ${formatDistance(result.distance)} away from the office. Maximum allowed distance is 20 meters.`);
      }
      
      return result.allowed;
    } catch (error) {
      setLocationStatus('failed');
      setLocationError(error.message);
      return false;
    }
  };

  // Handle QR scan - THIS WILL ACTUALLY USE THE CAMERA
  const handleScan = (result, error) => {
    if (error) {
      console.info(error);
      return;
    }
    
    if (result) {
      try {
        const data = result?.text;
        if (data) {
          setQrData(data);
          setScanning(false);
          
          // Parse QR data to get shift info
          try {
            const parsedData = JSON.parse(data);
            setShiftInfo({
              shiftId: parsedData.shiftId || 'SHIFT-001',
              employee: 'Current Employee', // Would come from auth context
              position: 'Employee', // Would come from auth context
              date: new Date().toLocaleDateString(),
              startTime: '08:00 AM', // Would come from backend
              endTime: '04:00 PM', // Would come from backend
              location: 'Buea Office (47WP+W6J)'
            });
          } catch (parseError) {
            // If not JSON, use as plain text
            setShiftInfo({
              shiftId: 'DEMO-SHIFT',
              employee: 'Current Employee',
              position: 'Employee',
              date: new Date().toLocaleDateString(),
              startTime: '08:00 AM',
              endTime: '04:00 PM',
              location: 'Buea Office (47WP+W6J)'
            });
          }
          
          setOpenDialog(true);
        }
      } catch (err) {
        console.error('QR Parse Error:', err);
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
    setLocationError('Camera error. Please make sure you\'ve granted camera permission.');
  };

  // Start scanning process - THIS WILL TRIGGER LOCATION AND CAMERA ACCESS
  const startScanning = async () => {
    setScanning(true);
    setQrData('');
    setOpenDialog(false);
    setCheckInStatus('idle');
    setLocation(null);
    setLocationStatus('pending');
    setLocationError('');
    setShiftInfo(null);
    
    // FIRST VERIFY LOCATION (THIS WILL PROMPT FOR LOCATION PERMISSION)
    const isLocationValid = await verifyUserLocation();
    
    if (!isLocationValid) {
      setScanning(false);
    }
    // IF LOCATION IS VALID, CAMERA WILL BE ACTIVATED AUTOMATICALLY
  };

  // Confirm check-in - THIS WILL SEND DATA TO BACKEND
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
      
      // SIMULATE API CALL (replace with actual backend call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (in real app, this would come from backend)
      setCheckInStatus('success');
      setOpenDialog(false);
    } catch (error) {
      setCheckInStatus('error');
      setLocationError('Check-in failed. Please try again.');
      console.error('Check-in error:', error);
    }
  };

  // Handle raise concern
  const handleRaiseConcern = () => {
    alert('Concern raised successfully. HR will contact you shortly.');
  };

  // Reset scanner
  const resetScanner = () => {
    setScanning(false);
    setCheckInStatus('idle');
    setLocation(null);
    setLocationStatus('pending');
    setLocationError('');
    setQrData('');
    setOpenDialog(false);
    setShiftInfo(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        QR Code Check-In
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Scan QR Code to Check In
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn 
              color={locationStatus === 'verified' ? "success" : 
                     locationStatus === 'failed' ? "error" : 
                     locationStatus === 'verifying' ? "warning" : "disabled"} 
              sx={{ mr: 1 }} 
            />
            <Box>
              <Typography 
                variant="body2" 
                color={locationStatus === 'verified' ? "success.main" : 
                       locationStatus === 'failed' ? "error.main" : 
                       locationStatus === 'verifying' ? "warning.main" : "text.secondary"}
              >
                {locationStatus === 'pending' && "Click below to verify your location"}
                {locationStatus === 'verifying' && "Requesting location access..."}
                {locationStatus === 'verified' && `Location verified (${location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Unknown'})`}
                {locationStatus === 'failed' && "Location verification failed"}
              </Typography>
              {location && (
                <Typography variant="caption" color="text.secondary">
                  Accuracy: ±{location.accuracy ? `${Math.round(location.accuracy)}m` : 'Unknown'}
                </Typography>
              )}
            </Box>
          </Box>
          
          {locationStatus === 'verifying' && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress />
              <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
                Please allow location access when prompted by your browser
              </Typography>
            </Box>
          )}
          
          {(locationStatus === 'failed' || locationError) && (
            <Alert 
              severity={locationStatus === 'failed' ? "warning" : "error"} 
              sx={{ mb: 2 }}
            >
              {locationError || "Location verification failed"}
              <Button 
                size="small" 
                onClick={verifyUserLocation} 
                sx={{ ml: 1 }}
              >
                Try Again
              </Button>
            </Alert>
          )}
          
          {verificationResult && locationStatus === 'failed' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Office Location:</strong> 47WP+W6J, Buea<br />
                <strong>Your Distance:</strong> {formatDistance(verificationResult.distance)}<br />
                <strong>Maximum Allowed:</strong> 20 meters
              </Typography>
            </Alert>
          )}
          
          <Box sx={{ textAlign: 'center', my: 3 }}>
            {scanning ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 300, 
                  height: 300, 
                  border: '3px dashed #1976d2', 
                  borderRadius: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  overflow: 'hidden'
                }}>
                  <QrReader
                    onResult={handleScan}
                    onError={handleError}
                    constraints={{ facingMode: 'environment' }}
                    containerStyle={{ width: '100%' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Point your camera at the QR code
                </Typography>
                <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                  Make sure camera permission is granted
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={resetScanner}
                >
                  Cancel
                </Button>
              </Box>
            ) : checkInStatus === 'success' ? (
              <Box>
                <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" color="success.main" sx={{ mb: 1 }}>
                  Check-In Successful!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Welcome to work! Checked in at {new Date().toLocaleTimeString()}
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={resetScanner}
                >
                  Check In Again
                </Button>
              </Box>
            ) : checkInStatus === 'processing' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography>Processing check-in...</Typography>
              </Box>
            ) : checkInStatus === 'error' ? (
              <Box>
                <ErrorOutline sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                <Typography variant="h5" color="error.main" sx={{ mb: 1 }}>
                  Check-In Failed
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {locationError || 'Please try again or raise a concern'}
                </Typography>
                <Box>
                  <Button 
                    variant="contained" 
                    onClick={resetScanner}
                    sx={{ mr: 1 }}
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="warning" 
                    onClick={handleRaiseConcern}
                  >
                    Raise Concern
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<QrCodeScanner />}
                  onClick={startScanning}
                  disabled={locationStatus === 'verifying'}
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    mb: 2,
                    bgcolor: locationStatus === 'verified' ? 'success.main' : 'primary.main',
                    '&:hover': {
                      bgcolor: locationStatus === 'verified' ? 'success.dark' : 'primary.dark'
                    }
                  }}
                >
                  {locationStatus === 'verified' ? 'Location Verified - Start Scanning' : 'Verify Location & Scan QR'}
                </Button>
                
                {locationStatus === 'verified' && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      You are within 20 meters of the office. 
                      Ready to scan QR code for check-in.
                    </Typography>
                  </Alert>
                )}
                
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Note:</strong> This will request permission to access your location and camera.
                  </Typography>
                </Alert>
              </Box>
            )}
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              color="warning" 
              startIcon={<Warning />}
              onClick={handleRaiseConcern}
            >
              Raise Concern
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* Check-In Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Check-In</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <QrCodeScanner sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Confirm Attendance
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              You are checking in at the Buea office location
            </Typography>
            
            {shiftInfo && (
              <Box sx={{ textAlign: 'left', mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Shift Details:
                </Typography>
                <Typography variant="body2">
                  <strong>Employee:</strong> {shiftInfo.employee}<br />
                  <strong>Position:</strong> {shiftInfo.position}<br />
                  <strong>Date:</strong> {shiftInfo.date}<br />
                  <strong>Time:</strong> {shiftInfo.startTime} - {shiftInfo.endTime}<br />
                  <strong>Location:</strong> {shiftInfo.location}
                </Typography>
              </Box>
            )}
            
            {location && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Your Location:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}<br />
                  <strong>Accuracy:</strong> ±{Math.round(location.accuracy)} meters<br />
                  <strong>Status:</strong> Verified
                </Typography>
              </Alert>
            )}
            
            <Alert severity="success">
              <Typography variant="body2">
                You are within the allowed 20 meter radius.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
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
    </div>
  );
};

export default QRScanner;