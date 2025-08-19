import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '..config.js';


const API_BASE_URL = api;

function Register({ onLogin }) {
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
      console.log('Registering at:', `${API_BASE_URL}/auth/register`);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="auth-link">
          <Link to="/login">Already have an account? Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;