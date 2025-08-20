import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployeeOnboarding from './components/auth/EmployeeOnboarding';
import AdminDashboard from './components/admin/AdminDashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import DashboardOverview from './components/admin/DashboardOverview';
import EmployeeManagement from './components/admin/EmployeeManagement';
import ShiftScheduling from './components/admin/ShiftScheduling';
import PayrollProcessing from './components/admin/PayrollProcessing';
import CheckIn from './components/employee/CheckIn';
import Schedule from './components/employee/Schedule';
import Payments from './components/employee/Payments';
import AttendanceDashboard from './components/admin/AttendanceDashboard';
import ChangePassword from './components/employee/ChangePassword';
import EmployeeDashboardOverview from './components/employee/DashboardOverview';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#388e3c',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? createTheme({ ...theme, palette: { ...theme.palette, mode: 'dark' } }) : theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/onboarding" element={<EmployeeOnboarding />} />
              
              {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard toggleDarkMode={toggleDarkMode} darkMode={darkMode} /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="dashboard" element={<DashboardOverview />} />
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="dashboard" element={<DashboardOverview />} />
                <Route path="scheduling" element={<ShiftScheduling />} />
                <Route path="payroll" element={<PayrollProcessing />} />
                <Route path="attendance" element={<AttendanceDashboard />} />
              <Route path="employee-onboarding" element={<ProtectedRoute><AdminDashboard><EmployeeOnboarding /></AdminDashboard></ProtectedRoute>} />
              </Route>
              
              {/* Employee Routes */}
              <Route path="/employee" element={<ProtectedRoute><EmployeeDashboard toggleDarkMode={toggleDarkMode} darkMode={darkMode} /></ProtectedRoute>}>
                <Route index element={<EmployeeDashboardOverview />} />
                <Route path="dashboard" element={<EmployeeDashboardOverview />} />
                <Route path="checkin" element={<CheckIn />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="payments" element={<Payments />} />
                <Route path="/employee/change-password" element={<ProtectedRoute><EmployeeDashboard><ChangePassword /></EmployeeDashboard></ProtectedRoute>} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      window.location.href = '/login';
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return children;
}

export default App;