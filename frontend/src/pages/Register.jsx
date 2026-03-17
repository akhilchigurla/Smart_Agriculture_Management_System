import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '', mobileNumber: '', email: '', password: '', confirmPassword: '', landOwned: '', role: 'farmer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors({ ...errors, email: t('auth.errors.email') });
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      await axios.post('http://localhost:5001/api/auth/send-otp', { email: formData.email });
      setIsOtpSent(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    setServerError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/verify-otp', { email: formData.email, otp });
      setVerificationToken(res.data.verificationToken);
      setIsEmailVerified(true);
      setIsOtpSent(false); // Hide OTP box after verification
      alert('Email verified successfully!');
    } catch (err) {
      setServerError(t('auth.errors.otp_invalid'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isEmailVerified || !verificationToken) {
      setServerError('Please verify your email first.');
      return;
    }
    let formErrors = {};

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = t('auth.errors.match');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      formErrors.email = t('auth.errors.email');
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.mobileNumber)) {
      formErrors.mobileNumber = t('auth.errors.mobile');
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = { ...formData, verificationToken };
      await axios.post('http://localhost:5001/api/auth/register', payload);
      alert('Registration successful! please login.');
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.message || t('auth.errors.reg_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '30px' }}>
      <div className="glass-panel" style={{ padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-dark)' }}>
          {t('auth.register_title')}
        </h2>
        {serverError && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{serverError}</p>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>{t('auth.role_label')}</label>
            <select name="role" className="form-control" onChange={handleChange} value={formData.role}>
              <option value="farmer">{t('auth.farmer')}</option>
              <option value="dealer">{t('auth.dealer')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('auth.full_name')}</label>
            <input type="text" name="name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t('auth.mobile')}</label>
            <input type="text" name="mobileNumber" className="form-control" onChange={handleChange} required />
            {errors.mobileNumber && <p style={{ color: 'red', fontSize: '13px', marginTop: '5px' }}>{errors.mobileNumber}</p>}
          </div>
          
          <div className="form-group">
            <label>{t('auth.email')}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                name="email" 
                className="form-control" 
                onChange={handleChange} 
                required 
                disabled={isEmailVerified}
              />
              {!isEmailVerified && (
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  className="btn" 
                  style={{ whiteSpace: 'nowrap', padding: '0 15px', fontSize: '0.85rem' }}
                  disabled={loading || !formData.email}
                >
                  {isOtpSent ? t('auth.resend_btn') : 'Verify'}
                </button>
              )}
              {isEmailVerified && <span style={{ color: '#1E8449', fontWeight: '600', display: 'flex', alignItems: 'center' }}>✓ Verified</span>}
            </div>
            {errors.email && <p style={{ color: 'red', fontSize: '13px', marginTop: '5px' }}>{errors.email}</p>}
          </div>

          {isOtpSent && !isEmailVerified && (
            <div className="form-group animate-fade-in" style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <label>{t('auth.otp_label')}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  maxLength="6" 
                  placeholder="------"
                  style={{ textAlign: 'center', letterSpacing: '4px' }}
                  required 
                />
                <button 
                  type="button" 
                  onClick={handleVerifyOtp} 
                  className="btn" 
                  style={{ whiteSpace: 'nowrap', padding: '0 15px', fontSize: '0.85rem' }}
                  disabled={loading || otp.length < 4}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>{t('auth.password')}</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" className="form-control" onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>{t('auth.confirm_password')}</label>
            <input type="password" name="confirmPassword" className="form-control" onChange={handleChange} required />
            {errors.confirmPassword && <p style={{ color: 'red', fontSize: '13px', marginTop: '5px' }}>{errors.confirmPassword}</p>}
          </div>
          {formData.role === 'farmer' && (
            <div className="form-group">
              <label>{t('auth.land')}</label>
              <input type="number" name="landOwned" className="form-control" onChange={handleChange} required />
            </div>
          )}
          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', marginTop: '15px', opacity: isEmailVerified ? 1 : 0.6 }} 
            disabled={loading || !isEmailVerified}
          >
            {loading ? '...' : t('auth.register_btn')}
          </button>
          <p style={{ marginTop: '20px', textAlign: 'center' }}>
            {t('auth.footer_have_account')} <Link to="/login" style={{ color: 'var(--primary)' }}>{t('auth.login_btn')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
