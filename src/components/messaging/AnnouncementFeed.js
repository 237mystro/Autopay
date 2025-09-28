import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar, CircularProgress, Alert } from '@mui/material';

const AnnouncementFeed = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/messages/announcements`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setAnnouncements(data.announcements || []);
        } else {
          setError(data.message || 'Failed to fetch announcements');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
      setLoading(false);
    };
    fetchAnnouncements();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}><CircularProgress /></Box>;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Announcements</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {announcements.length === 0 ? (
          <Typography variant="body2">No announcements yet.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {announcements.map((a, idx) => (
              <Card key={a._id || idx} sx={{ bgcolor: '#f5f7fa', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 1 }}>{a.sender?.name?.charAt(0) || 'A'}</Avatar>
                  <Typography variant="subtitle1">{a.sender?.name || 'Admin'}</Typography>
                  <Chip label={new Date(a.createdAt).toLocaleString()} size="small" sx={{ ml: 2 }} />
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>{a.content}</Typography>
                {a.fileUrl && (
                  <a href={a.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Chip label={a.fileName || 'Attachment'} icon={<Avatar>{a.fileType === 'image' ? '🖼️' : '📄'}</Avatar>} />
                  </a>
                )}
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementFeed;
