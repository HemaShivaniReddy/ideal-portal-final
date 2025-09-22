import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Manager from './pages/Manager';
import Expert from './pages/Expert';
import User from './pages/User';
import Idea from './pages/Idea';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<RoleBasedRoute role="admin"><Admin /></RoleBasedRoute>} />
        <Route path="/manager" element={<RoleBasedRoute role="manager"><Manager /></RoleBasedRoute>} />
        <Route path="/expert" element={<RoleBasedRoute role="expert"><Expert /></RoleBasedRoute>} />
        <Route path="/user" element={<RoleBasedRoute role="user"><User /></RoleBasedRoute>} />
        <Route path="/ideas" element={<ProtectedRoute><Idea /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
