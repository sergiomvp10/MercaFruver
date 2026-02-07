import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shiftId, setShiftId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mercafruver_user');
    const storedShiftId = localStorage.getItem('mercafruver_shiftId');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setShiftId(storedShiftId);
    }
    setLoading(false);
  }, []);

  const login = async (pin) => {
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      setUser(data.user);
      setShiftId(data.shiftId);
      localStorage.setItem('mercafruver_user', JSON.stringify(data.user));
      localStorage.setItem('mercafruver_shiftId', data.shiftId);

      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      if (user && shiftId) {
        await fetch('http://localhost:4000/api/users/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, shiftId }),
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setShiftId(null);
      localStorage.removeItem('mercafruver_user');
      localStorage.removeItem('mercafruver_shiftId');
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, shiftId, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
