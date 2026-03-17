import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || t('auth.errors.otp_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStep(3); // Simply move to password step; verification happens on final reset submit
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(t('auth.errors.match'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, { 
        email, 
        otp, 
        newPassword 
      });
      alert(t('auth.forgot.success'));
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.errors.reset_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '50px' }}>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-dark)' }}>{t('auth.forgot.title')}</h2>
        {error && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>{t('auth.forgot.email_label')}</label>
              <input 
                type="email" 
                className="form-control"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="example@gmail.com"
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? '...' : t('auth.forgot.send_otp')}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {t('auth.forgot.otp_sent_to', { email })}
            </p>
            <div className="form-group">
              <label>{t('auth.otp_label')}</label>
              <input 
                type="text" 
                className="form-control"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                maxLength="6"
                style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>
              {t('auth.forgot.verify_continue')}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>{t('auth.forgot.new_password')}</label>
              <input 
                type="password" 
                className="form-control"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('auth.confirm_password')}</label>
              <input 
                type="password" 
                className="form-control"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? '...' : t('auth.forgot.reset_submit')}
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            {t('auth.forgot.back_login')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
