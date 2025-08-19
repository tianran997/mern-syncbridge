import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '..config.js';

const API_BASE_URL = api;

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Logging in to:', `${API_BASE_URL}/auth/login`);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="auth-link">
          <Link to="/register">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;