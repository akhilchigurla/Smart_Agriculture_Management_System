import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, BASE_URL } from '../config';

const PestAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: '', district: '', mandal: '', village: '', lat: '', lng: '' });
  const [image, setImage] = useState(null);
  const [telanganaData, setTelanganaData] = useState(null);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch the exhaustive location dataset
    axios.get('/telangana.json')
      .then(res => setTelanganaData(res.data))
      .catch(err => console.error('Failed to load Telangana location data', err));
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pests`);
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    
    // Reset cascading dropdowns
    if (name === 'district') {
      newFormData.mandal = '';
      newFormData.village = '';
    } else if (name === 'mandal') {
      newFormData.village = '';
    }
    
    setFormData(newFormData);
  };

  const availableDistricts = telanganaData ? Object.keys(telanganaData) : [];
  const availableMandals = (telanganaData && formData.district) ? Object.keys(telanganaData[formData.district] || {}) : [];
  const availableVillages = (telanganaData && formData.district && formData.mandal) 
    ? (telanganaData[formData.district][formData.mandal] || []) 
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('description', formData.description);
    data.append('district', formData.district);
    data.append('mandal', formData.mandal);
    data.append('village', formData.village);
    data.append('lat', formData.lat || 17.3850);
    data.append('lng', formData.lng || 78.4867);
    if (image) data.append('image', image);

    try {
      await axios.post(`${API_BASE_URL}/pests`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAlerts();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to post alert');
    }
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary-dark)' }}>Community Pest Alerts</h2>
        {token && (
          <button className="btn btn-secondary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Alert'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-panel fade-in" style={{ padding: '20px', marginBottom: '30px' }}>
          <h3>Report a Pest Attack</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Description of Damage / Pest</label>
                <textarea className="form-control" onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
              </div>
              <div className="form-group">
                <label>Upload Image</label>
                <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} required />
              </div>
              <div className="form-group">
                <label>District</label>
                <select name="district" className="form-control" onChange={handleChange} value={formData.district || ''} required>
                  <option value="" disabled>Select District</option>
                  {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Mandal</label>
                <select name="mandal" className="form-control" onChange={handleChange} value={formData.mandal || ''} required disabled={!formData.district}>
                  <option value="" disabled>Select Mandal</option>
                  {availableMandals.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Village</label>
                <select name="village" className="form-control" onChange={handleChange} value={formData.village || ''} required disabled={!formData.mandal}>
                  <option value="" disabled>Select Village</option>
                  {availableVillages.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn" style={{ marginTop: '10px' }}>Submit Alert</button>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {alerts.map(alert => (
          <div key={alert._id} className="glass-panel feature-card fade-in" style={{ padding: '20px' }}>
            {alert.imageUrl && (
              <img src={`${BASE_URL}${alert.imageUrl}`} alt="Pest" style={{ width: '50%', height: 'auto', objectFit: 'contain', borderRadius: '8px', marginBottom: '15px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            )}
            <h4 style={{ color: 'red' }}>🚨 Warning in {alert.location?.village && `${alert.location.village}, `}{alert.location?.mandal}, {alert.location?.district}</h4>
            <p style={{ marginTop: '10px' }}><strong>Effected by:</strong> {alert.description}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>Reported by: {alert.addedBy?.name || 'Anonymous Farmer'}</p>
          </div>
        ))}
        {alerts.length === 0 && <p>No pest alerts reported in the community.</p>}
      </div>
      
    </div>
  );
};

export default PestAlerts;
