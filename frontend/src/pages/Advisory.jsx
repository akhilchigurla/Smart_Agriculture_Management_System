import React, { useState } from 'react';
import axios from 'axios';

const Advisory = () => {
  const [formData, setFormData] = useState({
    soilType: 'clay', ph: '', waterAvailability: 'high', season: 'kharif'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getAdvisory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/advisory', formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ marginTop: '30px', maxWidth: '600px' }}>
      <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>AI Crop Advisory</h2>
      
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <form onSubmit={getAdvisory}>
          <div className="form-group">
            <label>Soil Type</label>
            <select name="soilType" className="form-control" onChange={handleChange}>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
            </select>
          </div>
          <div className="form-group">
            <label>Soil pH Value</label>
            <input type="number" step="0.1" name="ph" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Water Availability</label>
            <select name="waterAvailability" className="form-control" onChange={handleChange}>
              <option value="high">High (Good Irrigation)</option>
              <option value="low">Low (Rainfed / Dry)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Season</label>
            <select name="season" className="form-control" onChange={handleChange}>
              <option value="kharif">Kharif (Monsoon)</option>
              <option value="rabi">Rabi (Winter)</option>
              <option value="zaid">Zaid (Summer)</option>
            </select>
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Analyzing...' : 'Get Recommended Crops'}
          </button>
        </form>
      </div>

      {result && (
        <div className="glass-panel fade-in" style={{ padding: '30px', borderLeft: '5px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '15px' }}>Recommendations</h3>
          <p>{result.message}</p>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            {result.recommendations.map((crop, idx) => (
              <li key={idx} style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                {crop}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Advisory;
