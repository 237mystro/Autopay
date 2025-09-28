// src/components/messaging/Conversation.js
import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {
  Box,
  List,
  ListItem,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person,
  Schedule,
  AccessTime,
  CheckCircle,
  Image,
  Description,
  InsertDriveFile
} from '@mui/icons-material';
import MessageInput from './MessageInput';
import { useSocket } from '../../contexts/SocketContext';

const Conversation = ({ 
  participant, 
  messages, 
  onSendMessage, 
  loading, 
  error,
  typingUsers 
}) => {
  const messagesEndRef = useRef(null);
  const { socket, connected } = useSocket();
  const [imagePreview, setImagePreview] = useState(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!participant) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        textAlign: 'center'
      }}>
        <Box>
          <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Select a conversation to start messaging
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Choose a contact from the list or start a new conversation
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Conversation Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Avatar sx={{ mr: 2 }}>
          {participant.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {participant.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {participant.position || participant.role} • {participant.company}
          </Typography>
        </Box>
      </Box>
      
      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: 2,
        bgcolor: 'grey.50',
        minHeight: 0,
        height: '100%',
        maxHeight: 'calc(100vh - 180px)'
      }}>
        {messages.length > 0 ? (
          <List>
            {messages.map((message, index) => {
              const isCurrentUser = message.sender._id === JSON.parse(localStorage.getItem('user')).id;
              const showDate = index === 0 || 
                new Date(messages[index-1].createdAt).toDateString() !== 
                new Date(message.createdAt).toDateString();
              
              return (
                <React.Fragment key={message._id}>
                  {showDate && (
                    <Box sx={{ textAlign: 'center', my: 2 }}>
                      <Chip label={formatDate(message.createdAt)} size="small" variant="outlined" />
                    </Box>
                  )}
                  
                  <ListItem sx={{ 
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    py: 0.5
                  }}>
                    <Box sx={{ 
                      maxWidth: '70%',
                      bgcolor: message.isAnnouncement ? '#fffbe6' : (isCurrentUser ? 'primary.main' : 'white'),
                      color: isCurrentUser ? 'white' : 'text.primary',
                      borderRadius: 2,
                      p: 1.5,
                      boxShadow: 1,
                      border: message.isAnnouncement ? '2px solid #ffd700' : undefined
                    }}>
                      {message.isAnnouncement && (
                        <Chip label="Announcement" color="warning" size="small" sx={{ mb: 1, fontWeight: 'bold' }} />
                      )}
                      {message.content && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {message.content}
                        </Typography>
                      )}

                      {/* Display image or file attachment */}
                      {message.fileUrl && message.fileType === 'image' && (
                        <Box sx={{ mb: 1 }}>
                          <img
                            src={message.fileUrl}
                            alt={message.fileName || 'attachment'}
                            style={{
                              maxWidth: '100%',
                              maxHeight: 200,
                              borderRadius: 8,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              cursor: 'pointer'
                            }}
                            onClick={e => {
                              setImagePreview(message.fileUrl);
                              e.stopPropagation();
                            }}
                          />
                        </Box>
                      )}
                      {message.fileUrl && message.fileType !== 'image' && (
                        <Box sx={{ mb: 1 }}>
                          <Chip
                            icon={<Description />}
                            label={message.fileName || 'Download file'}
                            clickable
                            component="a"
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              bgcolor: isCurrentUser ? 'primary.dark' : 'grey.200',
                              color: isCurrentUser ? 'white' : 'text.primary',
                              mr: 0.5,
                              mb: 0.5
                            }}
                          />
                        </Box>
                      )}
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        alignItems: 'center',
                        mt: 0.5
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isCurrentUser ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                          }}
                        >
                          {formatTime(message.createdAt)}
                        </Typography>
                        {isCurrentUser && message.isRead && (
                          <CheckCircle 
                            sx={{ 
                              fontSize: 14, 
                              ml: 0.5, 
                              color: 'rgba(255,255,255,0.7)' 
                            }} 
                          />
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </List>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start a conversation!
            </Typography>
          </Box>
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 1,
            p: 1,
            borderRadius: 2,
            bgcolor: 'white',
            boxShadow: 1
          }}>
            <Typography variant="body2" color="text.secondary">
              {typingUsers.join(', ')} is typing...
            </Typography>
            <CircularProgress size={16} sx={{ ml: 1 }} />
          </Box>
        )}
      </Box>
      
      {/* Message Input */}
      <MessageInput 
        onSendMessage={onSendMessage}
        disabled={!participant}
        receiverId={participant.id}
      />

      {/* Image Preview Modal */}
      <Dialog open={!!imagePreview} onClose={() => setImagePreview(null)} maxWidth="md">
        <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              display: 'block',
              margin: '0 auto',
              background: 'black'
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Conversation;