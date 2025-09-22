import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#f2f2f2', display:'flex', justifyContent:'space-between' }}>
      <div>
        <Link to="/dashboard">Dashboard</Link> | <Link to="/ideas">Ideas</Link>
        {token ? (
          <>
            {role === 'admin' && <> | <Link to="/admin">Admin</Link></>}
            {role === 'manager' && <> | <Link to="/manager">Manager</Link></>}
            {role === 'expert' && <> | <Link to="/expert">Expert</Link></>}
            {role === 'user' && <> | <Link to="/user">User</Link></>}
          </>
        ) : (
          <> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link></>
        )}
      </div>
      <div>{token && <button onClick={handleLogout}>Logout</button>}</div>
    </nav>
  );
}

export default Navbar;
