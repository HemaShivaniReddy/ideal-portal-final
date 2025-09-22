import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login');
  const navigate = useNavigate();

  const startLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/login', { email, password });
      setStep('otp');
      alert('OTP sent to your email');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div style={{ padding:20, maxWidth:400, margin:'0 auto' }}>
      {step === 'login' ? (
        <form onSubmit={startLogin}>
          <h2>Login</h2>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /><br/>
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          <h2>Enter OTP</h2>
          <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" /><br/>
          <button type="submit">Verify & Login</button>
        </form>
      )}
    </div>
  );
}

export default Login;
