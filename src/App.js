import React, { useState } from 'react';
import axios from 'axios';

// API base URL — set via env var when building the Docker image / K8s ConfigMap
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE}/register`, form);
      setMessage(res.data.message);
      setView('login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        email: form.email,
        password: form.password
      });
      localStorage.setItem('token', res.data.token);
      setLoggedInUser(res.data.name);
      setMessage('Login successful');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedInUser(null);
    setForm({ name: '', email: '', password: '' });
  };

  if (loggedInUser) {
    return (
      <div className="container">
        <h2>Welcome, {loggedInUser}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>{view === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={view === 'login' ? handleLogin : handleRegister}>
        {view === 'register' && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{view === 'login' ? 'Login' : 'Register'}</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p className="toggle" onClick={() => setView(view === 'login' ? 'register' : 'login')}>
        {view === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
      </p>
    </div>
  );
}

export default App;
