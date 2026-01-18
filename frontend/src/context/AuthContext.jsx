// Authentication context - manages user session globally
import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    console.log('Login function called');
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data);
    const { access_token, user: userData } = response.data;
    console.log('Storing token:', access_token);
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    console.log('Token stored, checking:', localStorage.getItem('token'));
    return userData;
  };

  // Register function
  const register = async (username, email, password, securityQuestion, securityAnswer) => {
    const response = await api.post('/register', { 
      username, 
      email, 
      password,
      security_question: securityQuestion,
      security_answer: securityAnswer
    });
    const { access_token, user: userData } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('showOnboarding', 'true');
    setUser(userData);
    return userData;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
