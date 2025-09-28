// src/components/admin/AnnouncementForm.js
import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Campaign,
  Send,
  AttachFile,
  Image,
  Description,
  InsertDriveFile
} from '@mui/icons-material';
import { useSocket } from '../../contexts/SocketContext';

const AnnouncementForm = () => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { socket, connected } = useSocket();
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length + attachments.length > 5) {
      setError('Maximum 5 attachments allowed');
      return;
    }
    
    const newAttachments = files.map(file => {
      // Determine file type for icon
      let type = 'other';
      if (file.type.startsWith('image/')) {
        type = 'image';
      } else if (file.type.includes('pdf') || file.type.includes('document')) {
        type = 'document';
      }
      
      return {
        file,
        filename: file.name,
        size: file.size,
        type
      };
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
    setError('');
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Send announcement
  const sendAnnouncement = async () => {
    if ((!content.trim() && attachments.length === 0) || sending) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      setSending(true);
      
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add announcement content
      formData.append('content', content.trim());
      
      // Add attachments if any
      if (attachments.length > 0) {
        attachments.forEach((attachment, index) => {
          formData.append('file', attachment.file);
        });
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/messages/announcement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
  setSuccess(`Announcement sent to ${data.announcements} employees`);
        setContent('');
        setAttachments([]);
        
        // Emit announcement via socket for real-time updates
        if (socket && connected) {
          const user = JSON.parse(localStorage.getItem('user'));
          socket.emit('announcement:send', {
            companyId: user.company,
            content: content.trim(),
            attachments: attachments.map(att => ({
              filename: att.filename,
              url: att.url,
              size: att.size,
              type: att.type
            }))
          });
        }
      } else {
        throw new Error(data.message || 'Failed to send announcement');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Send announcement error:', err);
    }
    
    setSending(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          <Campaign sx={{ mr: 1, verticalAlign: 'middle' }} />
          Send Announcement
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" noValidate>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Type your announcement..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          {/* Attachment Previews */}
          {attachments.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {attachments.map((attachment, index) => (
                <Chip
                  key={index}
                  avatar={
                    <Avatar>
                      {attachment.type === 'image' ? <Image /> : 
                       attachment.type === 'document' ? <Description /> : 
                       <InsertDriveFile />}
                    </Avatar>
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 150 }}>
                      <Typography variant="body2" noWrap>
                        {attachment.filename}
                      </Typography>
                    </Box>
                  }
                  onDelete={() => removeAttachment(index)}
                  size="small"
                  sx={{ 
                    mr: 0.5, 
                    mb: 0.5,
                    maxWidth: 200,
                    '& .MuiChip-label': {
                      overflow: 'hidden'
                    }
                  }}
                />
              ))}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
            
            <Button 
              variant="outlined" 
              startIcon={<AttachFile />}
              onClick={() => fileInputRef.current.click()}
              disabled={sending}
            >
              Attach Files
            </Button>
            
            <Button 
              variant="contained" 
              startIcon={sending ? <CircularProgress size={20} /> : <Send />}
              onClick={sendAnnouncement}
              disabled={(!content.trim() && attachments.length === 0) || sending}
            >
              {sending ? 'Sending...' : 'Send Announcement'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnnouncementForm;