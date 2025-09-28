// src/components/employee/EmployeeDashboard.js
import React, { useState,useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import QRScanner from './QRScanner';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  ListItemAvatar   } from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Schedule,
  Payment,
  Chat,
  AccountCircle,
  Brightness4,
  Brightness7,
  QrCodeScanner,
  ExitToApp,
  Notifications,
  Settings,
  Markunread   
} from '@mui/icons-material';


const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/employee/dashboard' },
  { text: 'Check-In', icon: <QrCodeScanner />, path: '/employee/checkin' },
  { text: 'My Schedule', icon: <Schedule />, path: '/employee/schedule' },
  { text: 'My Payments', icon: <Payment />, path: '/employee/payments' },
  { text: 'Messaging', icon: <Chat />, path: '/employee/messaging' },
  { text: 'Profile', icon: <AccountCircle />, path: '/employee/profile' },
  { text: 'Settings', icon: <Settings />, path: '/employee/settings' },
];



const EmployeeDashboard = ({ toggleDarkMode, darkMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); 

// Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleClose();
  };


  // Add state for notifications
const [notifications, setNotifications] = useState([]);
const [unreadNotifications, setUnreadNotifications] = useState(0);
const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

// Fetch notifications
const fetchNotifications = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/messages/unread-count`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      setUnreadNotifications(data.count);
    }
  } catch (err) {
    console.error('Fetch notifications error:', err);
  }
};

// Fetch recent messages for notifications
const fetchRecentMessages = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) return;

    const response = await fetch(`${process.env.REACT_APP_API_URL}/messages/${user._id}?limit=5`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      setNotifications(data.messages.filter(msg => !msg.isRead));
    }
  } catch (err) {
    console.error('Fetch recent messages error:', err);
  }
};

// Handle notification menu
const handleNotificationMenu = (event) => {
  setNotificationAnchorEl(event.currentTarget);
  fetchRecentMessages();
};

const handleNotificationClose = () => {
  setNotificationAnchorEl(null);
};

// Add to useEffect
useEffect(() => {
  fetchNotifications();
  
  // Poll for notifications every 30 seconds
  const interval = setInterval(() => {
    fetchNotifications();
  }, 30000);
  
  return () => clearInterval(interval);
}, []);


  const drawer = (
    <div>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap component="div">
          AutoPayroll
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
  position="fixed"
  sx={{
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    ml: { sm: `${drawerWidth}px` },
  }}
>
  <Toolbar>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
      sx={{ mr: 2, display: { sm: 'none' } }}
    >
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
      Employee Dashboard
    </Typography>
    
    <IconButton color="inherit" onClick={toggleDarkMode}>
      {darkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
    
    <IconButton 
      color="inherit" 
      onClick={handleNotificationMenu}
    >
      <Badge badgeContent={unreadNotifications} color="secondary">
        <Notifications />
      </Badge>
    </IconButton>
    
    <Menu
      id="notification-menu"
      anchorEl={notificationAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(notificationAnchorEl)}
      onClose={handleNotificationClose}
    >
      <MenuItem>
        <Typography variant="h6">Notifications</Typography>
      </MenuItem>
      <Divider />
      
      {notifications.length > 0 ? (
        <List sx={{ minWidth: 300 }}>
          {notifications.map((notification) => (
            <ListItem key={notification._id}>
              <ListItemAvatar>
                <Avatar>
                  {notification.sender.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={notification.subject} 
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {notification.sender.name}
                    </Typography>
                    {' — '}
                    {notification.content.substring(0, 50)}
                    {notification.content.length > 50 ? '...' : ''}
                  </>
                } 
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <MenuItem>
          <Typography variant="body2" color="text.secondary">
            No new notifications
          </Typography>
        </MenuItem>
      )}
      
      <Divider />
      <MenuItem onClick={() => { handleNotificationClose(); navigate('/employee/messaging'); }}>
        <Markunread sx={{ mr: 1 }} /> View All Messages
      </MenuItem>
    </Menu>
    
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleMenu}
      color="inherit"
    >
      <Avatar sx={{ width: 32, height: 32 }}>
        {user.name ? user.name.charAt(0) : 'E'}
      </Avatar>
    </IconButton>
    
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>Profile</MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
      <MenuItem onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        handleClose();
      }}>
        Logout
      </MenuItem>
    </Menu>
  </Toolbar>
</AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;