import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      alert('Registered. Now login to receive OTP.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding:20, maxWidth:400, margin:'0 auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" /><br/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><br/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
