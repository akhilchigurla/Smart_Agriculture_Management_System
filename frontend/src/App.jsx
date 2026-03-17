import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Fertilizers from './pages/Fertilizers';
import Equipment from './pages/Equipment';
import Advisory from './pages/Advisory';
import Disease from './pages/Disease';
import Weather from './pages/Weather';
import PestAlerts from './pages/PestAlerts';
import AddListing from './pages/AddListing';
import AdminDashboard from './pages/AdminDashboard';
import DripIrrigation from './pages/DripIrrigation';
import MyBookings from './pages/MyBookings';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-brand">{t('common.title')}</Link>
        <div className="nav-links">
          {!token && (
            <div className="language-toggle" style={{ marginRight: '10px', display: 'flex', gap: '5px' }}>
              <button 
                onClick={() => changeLanguage('en')} 
                className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
              >EN</button>
              <button 
                onClick={() => changeLanguage('te')} 
                className={`lang-btn ${i18n.language === 'te' ? 'active' : ''}`}
              >తెలుగు</button>
            </div>
          )}
          {token ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
              {location.pathname !== '/' && user?.role === 'farmer' && (
                <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
                  <Link to="/" style={{ backgroundColor: '#F2F4F4', padding: '5px 10px', borderRadius: '12px', color: '#2C3E50', fontSize: '11.5px', fontWeight: 'bold' }}>{t('common.home')}</Link>
                  <Link to="/fertilizers" style={{ backgroundColor: '#E9F7EF', padding: '5px 10px', borderRadius: '12px', color: '#1E8449', fontSize: '11.5px' }}>{t('nav.fertilizers')}</Link>
                  <Link to="/equipment" style={{ backgroundColor: '#FEF9E7', padding: '5px 10px', borderRadius: '12px', color: '#B7950B', fontSize: '11.5px' }}>{t('nav.equipment')}</Link>
                  <Link to="/advisory" style={{ backgroundColor: '#EBF5FB', padding: '5px 10px', borderRadius: '12px', color: '#2874A6', fontSize: '11.5px' }}>{t('nav.advisory')}</Link>
                  <Link to="/disease" style={{ backgroundColor: '#FDEDEC', padding: '5px 10px', borderRadius: '12px', color: '#CB4335', fontSize: '11.5px' }}>{t('nav.disease')}</Link>
                  <Link to="/weather" style={{ backgroundColor: '#F4ECF7', padding: '5px 10px', borderRadius: '12px', color: '#884EA0', fontSize: '11.5px' }}>{t('nav.weather')}</Link>
                  <Link to="/irrigation" style={{ backgroundColor: '#EAF2F8', padding: '5px 10px', borderRadius: '12px', color: '#2E86C1', fontSize: '11.5px' }}>{t('nav.irrigation')}</Link>
                  <Link to="/pests" style={{ backgroundColor: '#FEF5E7', padding: '5px 10px', borderRadius: '12px', color: '#BA4A00', fontSize: '11.5px' }}>{t('nav.pests')}</Link>
                  <Link to="/my-bookings" style={{ backgroundColor: '#FDF2E9', padding: '5px 10px', borderRadius: '12px', color: '#A04000', fontSize: '11.5px' }}>{t('nav.bookings')}</Link>
                </div>
              )}
              {user?.role === 'dealer' && (
                <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
                  {location.pathname !== '/' && <Link to="/" style={{ backgroundColor: '#F2F4F4', padding: '5px 10px', borderRadius: '12px', color: '#2C3E50', fontSize: '11.5px', fontWeight: 'bold' }}>{t('common.home')}</Link>}
                  <Link to="/fertilizers" style={{ backgroundColor: '#E9F7EF', padding: '5px 10px', borderRadius: '12px', color: '#1E8449', fontSize: '11.5px' }}>{t('nav.fertilizers')}</Link>
                  <Link to="/equipment" style={{ backgroundColor: '#FEF9E7', padding: '5px 10px', borderRadius: '12px', color: '#B7950B', fontSize: '11.5px' }}>{t('nav.equipment')}</Link>
                  <Link to="/add-listing" style={{ backgroundColor: '#EBF5FB', padding: '5px 10px', borderRadius: '12px', color: '#2874A6', fontSize: '11.5px' }}>Add Listing</Link>
                </div>
              )}
              <span style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{t('common.hi', { name: user?.name })}</span>
              <button onClick={handleLogout} className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem', backgroundColor: '#e53935' }}>{t('common.logout')}</button>
            </div>
          ) : (
            <>
              <Link to="/" style={{ backgroundColor: '#e3f2fd', padding: '6px 12px', borderRadius: '15px' }}>{t('common.home')}</Link>
              <Link to="/login" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>{t('common.login')}</Link>
            </>
          )}
        </div>
      </nav>
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/fertilizers" element={<Fertilizers />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/disease" element={<Disease />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/irrigation" element={<DripIrrigation />} />
          <Route path="/pests" element={<PestAlerts />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
