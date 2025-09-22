import React from 'react';
import { Navigate } from 'react-router-dom';

function RoleBasedRoute({ role, children }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role !== userRole) return <Navigate to="/dashboard" />;
  return children;
}

export default RoleBasedRoute;
