// src/contexts/AuthContext.js (fixed version)
import React, { useContext, useState, useEffect } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
    
    setLoading(false);
  }, []);

  function signup(email, password, name, company, role) {
    return new Promise((resolve, reject) => {
      // This should make an actual API call
      setTimeout(() => {
        // Simulate API error for empty fields
        if (!email || !password || !name || !company) {
          reject(new Error('All fields are required'));
          return;
        }
        
        const user = { email, name, company, role };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        resolve();
      }, 1000);
    });
  }

  function login(email, password) {
    return new Promise((resolve, reject) => {
      // This should make an actual API call
      setTimeout(() => {
        // Simulate API error for empty fields
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }
        
        const user = { email, name: 'Admin User', company: 'ABC Corp', role: 'admin' };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        resolve();
      }, 1000);
    });
  }

  function onboardEmployee(email, name, phone, momoNumber, position) {
    return new Promise((resolve, reject) => {
      // This should make an actual API call
      setTimeout(() => {
        // Simulate API error for empty fields
        if (!email || !name || !phone || !momoNumber || !position) {
          reject(new Error('All fields are required'));
          return;
        }
        
        const user = { email, name, phone, momoNumber, position, role: 'employee' };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        resolve();
      }, 1000);
    });
  }

  function logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        resolve();
      }, 500);
    });
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    onboardEmployee
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}