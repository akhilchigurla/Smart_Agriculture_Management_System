import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email: normalizedEmail, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || t('auth.errors.login_failed'));
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-dark)' }}>{t('auth.login_title')}</h2>
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>{t('auth.email')}</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t('auth.password')}</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>{t('auth.login_btn')}</button>
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>
              {t('auth.forgot.title')}
            </Link>
          </div>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          {t('auth.footer_no_account')} <Link to="/register" style={{ color: 'var(--primary)' }}>{t('auth.register_btn')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
