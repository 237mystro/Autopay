// src/components/messaging/MessagingDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  Badge
} from '@mui/material';
import {
  Search,
  Person,
  Markunread,
  Drafts,
  Send,
  AttachFile,
  Image,
  Description,
  InsertDriveFile,
  Campaign
} from '@mui/icons-material';

import { Button } from '@mui/material';
import Conversation from './Conversation';
// import AnnouncementFeed from './AnnouncementFeed';
import { useSocket } from '../../contexts/SocketContext';

const MessagingDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const { socket, connected, unreadCount, setUnreadCount } = useSocket();
  const typingTimeoutRef = useRef(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/messages/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.contacts);
      } else {
        setError(data.message || 'Failed to fetch conversations');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (userId) => {
    try {
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
      } else {
        setError(data.message || 'Failed to fetch messages');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch messages error:', err);
    }
  };

  // Send message
  const sendMessage = async (messageData) => {
    if (!selectedConversation) {
      setError('Please select a conversation first');
      return;
    }

    try {
      setError('');
      
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add message content
      formData.append('receiverId', selectedConversation.user.id);
      formData.append('content', messageData.content);
      
      // Add attachments if any
      if (messageData.attachments && messageData.attachments.length > 0) {
        messageData.attachments.forEach((attachment, index) => {
          formData.append('file', attachment.file);
        });
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/messages/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add new message to the messages list instantly
        setMessages(prev => [...prev, data.message]);
        // Emit message via socket for real-time updates
        if (socket && connected) {
          socket.emit('message:send', {
            receiverId: selectedConversation.user.id,
            content: messageData.content,
            attachments: messageData.attachments.map(att => ({
              filename: att.filename,
              url: att.url,
              size: att.size,
              type: att.type
            }))
          });
        }
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Send message error:', err);
    }
  };

  // Select conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.user.id);
  };

  // Handle new message received via socket
  const handleNewMessage = (event) => {
    const message = event.detail.message;
    
    // If we're in the conversation with this sender, add the message
    if (selectedConversation && message.sender._id === selectedConversation.user.id) {
      setMessages(prev => [...prev, message]);
    }
    
    // Refresh conversations to update last message
    fetchConversations();
    
    // Update unread count
    setUnreadCount(prev => prev + 1);
  };

  // Handle user typing start
  const handleUserTypingStart = (event) => {
    const { senderId } = event.detail;
    
    // If we're in a conversation with this user
    if (selectedConversation && senderId === selectedConversation.user.id) {
      setTypingUsers(prev => {
        if (!prev.includes(selectedConversation.user.name)) {
          return [...prev, selectedConversation.user.name];
        }
        return prev;
      });
      
      // Clear timeout if exists
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers(prev => prev.filter(name => name !== selectedConversation.user.name));
      }, 3000);
    }
  };

  // Handle user typing stop
  const handleUserTypingStop = (event) => {
    const { senderId } = event.detail;
    
    // If we're in a conversation with this user
    if (selectedConversation && senderId === selectedConversation.user.id) {
      setTypingUsers(prev => prev.filter(name => name !== selectedConversation.user.name));
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Add event listeners for socket events
    window.addEventListener('newMessageReceived', handleNewMessage);
    window.addEventListener('userTypingStart', handleUserTypingStart);
    window.addEventListener('userTypingStop', handleUserTypingStop);
    
    return () => {
      window.removeEventListener('newMessageReceived', handleNewMessage);
      window.removeEventListener('userTypingStart', handleUserTypingStart);
      window.removeEventListener('userTypingStop', handleUserTypingStop);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedConversation]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Grid container sx={{ flexGrow: 1, height: '100%' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4} sx={{ borderRight: { md: '1px solid #f2e8e8ff' }, height: '100%' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 0, height: '100%' }}>
              {/* Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Messages</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge badgeContent={unreadCount} color="primary">
                      <Markunread />
                    </Badge>
                    {/* Announcements button for admins */}
                    {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'admin' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Campaign />}
                        onClick={() => window.location.href = '/admin/messaging/announcements'}
                        sx={{ ml: 1 }}
                      >
                        Announcements
                      </Button>
                    )}
                  </Box>
                </Box>
                
                <TextField
                  fullWidth
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  size="small"
                  variant="outlined"
                />
              </Box>
              
              {/* Conversations */}
              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List>
                  {conversations
                    .filter(conv => 
                      conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      conv.user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => {
                      // If both have lastMessage, sort by createdAt desc
                      if (a.lastMessage && b.lastMessage) {
                        return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
                      }
                      // If only one has lastMessage, put that one first
                      if (a.lastMessage) return -1;
                      if (b.lastMessage) return 1;
                      // If neither has lastMessage, keep original order
                      return 0;
                    })
                    .map((conversation) => (
                    <ListItem 
                      key={conversation.user.id}
                      button={"true"}
                      selected={selectedConversation && selectedConversation.user.id === conversation.user.id}
                      onClick={() => handleSelectConversation(conversation)}
                      sx={{ 
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': { borderBottom: 'none' },
                        bgcolor: selectedConversation && selectedConversation.user.id === conversation.user.id ? 
                          'action.selected' : 'inherit'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {conversation.user.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={conversation.user.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {conversation.lastMessage ? conversation.lastMessage.content.substring(0, 30) : 'No messages'}
                            </Typography>
                            {conversation.lastMessage && (
                              <>
                                {' — '}
                                {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </>
                            )}
                          </>
                        }
                      />
                      {conversation.unreadCount > 0 && (
                        <Chip 
                          label={conversation.unreadCount} 
                          size="small" 
                          color="primary" 
                          sx={{ height: 20, minWidth: 20 }}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Chat Area */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Conversation 
              participant={selectedConversation ? selectedConversation.user : null}
              messages={messages}
              onSendMessage={sendMessage}
              loading={false}
              error={error}
              typingUsers={typingUsers}
            />
          </Card>
        </Grid>
      </Grid>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20,
            maxWidth: 400
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default MessagingDashboard;