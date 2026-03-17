import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t, i18n } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const [showModules, setShowModules] = useState(false);
  const modulesRef = useRef(null);

  const modules = [
    { to: '/fertilizers', title: t('home.modules.fertilizers.title'), desc: t('home.modules.fertilizers.desc'), img: '/images/fertilizer_bg.png' },
    { to: '/equipment', title: t('home.modules.equipment.title'), desc: t('home.modules.equipment.desc'), img: '/images/equipment_bg.png' },
    { to: '/advisory', title: t('home.modules.advisory.title'), desc: t('home.modules.advisory.desc'), img: '/images/advisory_bg.png' },
    { to: '/disease', title: t('home.modules.disease.title'), desc: t('home.modules.disease.desc'), img: '/images/disease_bg.png' },
    { to: '/weather', title: t('home.modules.weather.title'), desc: t('home.modules.weather.desc'), img: '/images/weather_bg.png' },
    { to: '/irrigation', title: t('home.modules.irrigation.title'), desc: t('home.modules.irrigation.desc'), img: '/images/irrigation_bg.png' },
    { to: '/pests', title: t('home.modules.pests.title'), desc: t('home.modules.pests.desc'), img: '/images/pests_bg.png' },
    { to: '/my-bookings', title: t('home.modules.bookings.title'), desc: t('home.modules.bookings.desc'), img: '/images/bookings_bg.png' },
  ];

  const handleExplore = () => {
    const nextState = !showModules;
    setShowModules(nextState);
    if (nextState) {
      setTimeout(() => {
        modulesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section" style={{ height: token ? '400px' : '600px' }}>
        <div className="hero-overlay">
          <div className="hero-content fade-in">
            <h1>{t('home.hero_title')}</h1>
            <p>{t('home.hero_subtitle')}</p>
            {token && (user?.role === 'dealer' || user?.role === 'admin') && (
              <div className="hero-buttons">
                <Link to="/add-listing" className="btn btn-secondary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
                  + Add New Listing
                </Link>
              </div>
            )}
            {token && user?.role === 'farmer' ? (
              <button onClick={handleExplore} className="btn btn-secondary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
                {showModules ? t('home.buttons.close') : t('home.buttons.explore')}
              </button>
            ) : !token && (
              <>
                <div className="hero-buttons">
                  <Link to="/register" className="btn btn-secondary" style={{ marginRight: '15px' }}>{t('home.buttons.register')}</Link>
                  <Link to="/login" className="btn btn-secondary">{t('home.buttons.login')}</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container" ref={modulesRef}>
        {token && user?.role === 'farmer' && showModules ? (
          <div className="home-modules-container fade-in">
            {modules.map((m, i) => (
              <Link key={i} to={m.to} className="home-module-card">
                <div className="home-module-bg" style={{ backgroundImage: `url(${m.img})` }}></div>
                <div className="home-module-overlay">
                  <div className="home-module-content">
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : !token && (
          <div className="features-section fade-in">
            <h2 style={{ color: 'white' }}>{t('home.services_title')}</h2>
            <div className="grid grid-3">
              <div className="glass-panel feature-card">
                <h3>{t('home.services.fertilizer.title')}</h3>
                <p>{t('home.services.fertilizer.desc')}</p>
              </div>
              <div className="glass-panel feature-card">
                <h3>{t('home.services.equipment.title')}</h3>
                <p>{t('home.services.equipment.desc')}</p>
              </div>
              <div className="glass-panel feature-card">
                <h3>{t('home.services.disease.title')}</h3>
                <p>{t('home.services.disease.desc')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
