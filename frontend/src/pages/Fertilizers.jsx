import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
// Leaflet imports and fix removed as map is no longer needed

const Fertilizers = () => {
  const [fertilizers, setFertilizers] = useState([]);
  const [district, setDistrict] = useState('');
  const [mandal, setMandal] = useState('');
  const [bookMsg, setBookMsg] = useState('');
  const [bookErr, setBookErr] = useState('');
  const [telanganaData, setTelanganaData] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/telangana.json')
      .then(res => setTelanganaData(res.data))
      .catch(err => console.error('Failed to load location data', err));
  }, []);

  const fetchFertilizers = async () => {
    try {
      let query = '';
      if (district) query += `?district=${district}`;
      if (mandal) query += query ? `&mandal=${mandal}` : `?mandal=${mandal}`;
      
      const res = await axios.get(`${API_BASE_URL}/fertilizers${query}`);
      setFertilizers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFertilizers();
  }, [district, mandal]);

  const handleBook = async (fertilizerId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/fertilizers/book`, 
        { fertilizerId, landOwned: user.landOwned || 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookMsg(res.data.message);
      setBookErr('');
      fetchFertilizers(); // refresh
    } catch (err) {
      setBookErr(err.response?.data?.message || 'Booking failed');
      setBookMsg('');
    }
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>Fertilizer Marketplace</h2>
        {(user.role === 'dealer' || user.role === 'admin') && (
          <button className="btn btn-secondary" onClick={() => window.location.href='/add-listing'}>
            + Add New Fertilizer
          </button>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Filter by Location</h3>
        <div className="grid grid-3">
          <select 
            className="form-control" 
            value={district} 
            onChange={e => {
              setDistrict(e.target.value);
              setMandal('');
            }}
          >
            <option value="">All Districts</option>
            {telanganaData && Object.keys(telanganaData).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          
          <select 
            className="form-control" 
            value={mandal} 
            onChange={e => setMandal(e.target.value)}
            disabled={!district}
          >
            <option value="">All Mandals</option>
            {telanganaData && district && Object.keys(telanganaData[district] || {}).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          
          <button className="btn" onClick={fetchFertilizers}>Refresh</button>
        </div>
      </div>

      {bookMsg && <p style={{ color: 'var(--primary)', marginBottom: '15px', fontWeight: 'bold' }}>{bookMsg}</p>}
      {bookErr && <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{bookErr}</p>}

      <div className="grid grid-2" style={{ marginBottom: '40px' }}>
        {fertilizers.filter(f => f.bagsAvailable > 0).map(f => (
          <div key={f._id} className="glass-panel feature-card">
            <div style={{ height: '200px', overflow: 'hidden', borderRadius: '8px', marginBottom: '15px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={f.imageUrl} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>{f.name}</h3>
            <p><strong>Shop:</strong> {f.shopName}</p>
            <p><strong>Available:</strong> {f.bagsAvailable} Bags</p>
            <p><strong>Price:</strong> ₹{f.pricePerBag} per bag</p>
            <p><strong>Location:</strong> {f.village}, {f.mandal}, {f.district}</p>
            <p><strong>Contact:</strong> {f.addedBy?.mobileNumber}</p>
            
            {user.role === 'farmer' && f.bagsAvailable > 0 && (
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '15px' }}
                onClick={() => handleBook(f._id)}
              >
                Book for {user.landOwned} Acres (Needs {user.landOwned * 2} bags)
              </button>
            )}
            {f.bagsAvailable === 0 && <p style={{ color: 'red', marginTop: '10px' }}>Out of Stock</p>}
          </div>
        ))}
        {fertilizers.filter(f => f.bagsAvailable > 0).length === 0 && <p>No available fertilizers found in this area.</p>}
      </div>

    </div>
  );
};

export default Fertilizers;
