import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getWeatherDescription = (code) => {
    if (code === 0) return '☀️ Clear Sky';
    if (code <= 3) return '🌤️ Partly Cloudy';
    if (code <= 49) return '🌫️ Foggy';
    if (code <= 69) return '🌧️ Drizzle / Rain';
    if (code <= 79) return '❄️ Snowfall';
    if (code <= 99) return '⛈️ Thunderstorm';
    return '🌡️ Unknown';
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode to get location name
          const geoRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const addr = geoRes.data.address;
          const name = addr.city || addr.town || addr.village || addr.county || 'Your Location';
          const state = addr.state || '';
          setLocationName(`${name}, ${state}`);

          // Fetch real weather from Open-Meteo (no API key needed)
          const weatherRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability&timezone=auto`
          );
          const current = weatherRes.data.current_weather;
          const humidity = weatherRes.data.hourly.relative_humidity_2m[0];
          const rainChance = weatherRes.data.hourly.precipitation_probability[0];

          setWeather({
            temp: Math.round(current.temperature),
            windSpeed: Math.round(current.windspeed),
            forecast: getWeatherDescription(current.weathercode),
            humidity,
            rainChance,
          });
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch weather data. Please try again.');
          setLoading(false);
        }
      },
      (err) => {
        setError('Location access denied. Please allow location access to see weather.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="container" style={{ marginTop: '30px', maxWidth: '600px' }}>
      <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>🌦️ Weather Dashboard</h2>

      <div className="glass-panel" style={{ padding: '30px', background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', color: 'white' }}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem' }}>📍 Detecting your location...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', color: '#ffcdd2' }}>⚠️ {error}</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.3rem' }}>📍</span>
              <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>{locationName}</h3>
            </div>
            <h3 style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>Current Weather</h3>
            <h1 style={{ fontSize: '4rem', margin: '10px 0' }}>{weather.temp}°C</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{weather.forecast}</p>
            <div className="grid grid-2" style={{ marginTop: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '15px' }}>
                <strong>💧 Humidity</strong>
                <p style={{ fontSize: '1.4rem', marginTop: '5px' }}>{weather.humidity}%</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '15px' }}>
                <strong>💨 Wind Speed</strong>
                <p style={{ fontSize: '1.4rem', marginTop: '5px' }}>{weather.windSpeed} km/h</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '15px', marginTop: '10px' }}>
                <strong>🌧️ Rain Chance</strong>
                <p style={{ fontSize: '1.4rem', marginTop: '5px' }}>{weather.rainChance}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
