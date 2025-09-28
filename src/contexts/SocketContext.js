// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Authenticate socket
      newSocket.emit('authenticate', token);

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        newSocket.emit('authenticate', token);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      // Handle incoming messages
      newSocket.on('message:receive', (data) => {
        console.log('New message received:', data);
        window.dispatchEvent(new CustomEvent('newMessageReceived', { detail: data }));
      });

      // Handle incoming announcements
      newSocket.on('announcement:receive', (data) => {
        console.log('New announcement received:', data);
        window.dispatchEvent(new CustomEvent('newAnnouncementReceived', { detail: data }));
      });

      // Handle typing indicators
      newSocket.on('typing:start', (data) => {
        window.dispatchEvent(new CustomEvent('userTypingStart', { detail: data }));
      });

      newSocket.on('typing:stop', (data) => {
        window.dispatchEvent(new CustomEvent('userTypingStop', { detail: data }));
      });

      // Handle user online/offline status
      newSocket.on('user:online', (data) => {
        window.dispatchEvent(new CustomEvent('userOnline', { detail: data }));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'}/messages/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (err) {
      console.error('Fetch unread count error:', err);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchUnreadCount();
      
      // Poll for unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [connected]);

  const value = {
    socket: socketRef.current,
    connected,
    unreadCount,
    setUnreadCount,
    fetchUnreadCount
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};