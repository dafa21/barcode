/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Login } from './components/Login.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Scanner } from './components/Scanner.tsx';
import { GuestRSVP } from './components/GuestRSVP.tsx';
import { User } from './types.ts';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.ok) {
            const parsed = JSON.parse(storedUser);
            if (!parsed.role) {
              // Clear invalid old session
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setUser(null);
            } else {
              setUser(parsed);
            }
          } else {
            // Token expired or invalid
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = (user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/rsvp/:barcodeUid" element={<GuestRSVP />} />
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/scanner/:eventId" 
          element={user ? <Scanner user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
