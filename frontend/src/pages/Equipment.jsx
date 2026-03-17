import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
// Leaflet imports removed as map is no longer needed

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [district, setDistrict] = useState('');
  const [mandal, setMandal] = useState('');
  const [telanganaData, setTelanganaData] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/telangana.json')
      .then(res => setTelanganaData(res.data))
      .catch(e => console.error('Failed to load location data', e));
  }, []);

  const fetchEquipment = async () => {
    try {
      let query = '';
      if (district) query += `?district=${district}`;
      if (mandal) query += query ? `&mandal=${mandal}` : `?mandal=${mandal}`;
      
      const res = await axios.get(`${API_BASE_URL}/equipment${query}`);
      setEquipment(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEquipment();
    const interval = setInterval(fetchEquipment, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [district, mandal]);

  const getRemainingTimeStr = (bookedUntil) => {
    if (!bookedUntil) return "";
    const diff = new Date(bookedUntil) - new Date();
    if (diff <= 0) return "";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleBook = async (id) => {
    if (!district || !mandal) {
      setErr('Please select both District and Mandal to proceed with booking');
      setMsg('');
      // Scroll to top to see the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const hours = prompt('How many hours do you want to rent this equipment for?');
    if (!hours || isNaN(hours) || Number(hours) <= 0) return;

    console.log('Attempting booking for:', { equipmentId: id, hours, token: token ? 'Present' : 'Missing' });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/equipment/book`,
        { equipmentId: id, rentalHours: Number(hours) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Booking success response:', res.data);
      setMsg(res.data.message);
      setErr('');
      fetchEquipment();
    } catch (e) {
      console.error('Full Booking Error Object:', e);
      const errorMsg = e.response?.data?.message || e.response?.data?.error || e.message || 'Unknown booking failure';
      setErr(`Booking failed: ${errorMsg}`);
      setMsg('');
    }
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>Equipment Rental</h2>
        {(user.role === 'dealer' || user.role === 'admin') && (
          <button className="btn btn-secondary" onClick={() => window.location.href='/add-listing'}>
            + Add New Equipment
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
          
          <button className="btn" onClick={fetchEquipment}>Refresh</button>
        </div>
      </div>

      {msg && <p style={{ color: 'var(--primary)', marginBottom: '15px', fontWeight: 'bold' }}>{msg}</p>}
      {err && <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{err}</p>}

      <div className="grid grid-2" style={{ marginBottom: '40px' }}>
        {equipment.map(eq => (
          <div key={eq._id} className="glass-panel feature-card">
            <div style={{ height: '200px', overflow: 'hidden', borderRadius: '8px', marginBottom: '15px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <img src={eq.imageUrl} alt={eq.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>{eq.name}</h3>
            <p><strong>Rental Price:</strong> ₹{eq.rentalPricePerHour} / hour</p>
            {eq.village || eq.mandal || eq.district ? (
              <p><strong>Location:</strong> {eq.village}, {eq.mandal}, {eq.district}</p>
            ) : (
              <p><strong>Location:</strong> Not Specified</p>
            )}
            <p><strong>Status:</strong> {eq.isAvailable ? <span style={{ color: 'var(--primary)' }}>Available</span> : <span style={{ color: 'red' }}>Currently Rented Out</span>}</p>
            {!eq.isAvailable && (
              <p style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '8px', fontSize: '0.95rem', marginTop: '10px', border: '1px solid #ffeeba' }}>
                <i className="fas fa-clock" style={{ marginRight: '5px' }}></i>
                <strong>Next Slot:</strong> {eq.bookedUntil ? (
                  <>You can book after <strong>{getRemainingTimeStr(eq.bookedUntil)}</strong></>
                ) : (
                  <>Available soon (processing...)</>
                )}
              </p>
            )}
            <p><strong>Owner Contact:</strong> {eq.ownerContact}</p>
            <p><strong>Added By:</strong> {eq.addedBy?.name}</p>
            
            {user.role === 'farmer' && (
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '15px', width: '100%' }}
                onClick={() => handleBook(eq._id)}
                disabled={!eq.isAvailable}
              >
                {eq.isAvailable ? 'Booking' : (eq.bookedUntil ? `Book Available in ${getRemainingTimeStr(eq.bookedUntil)}` : 'Booked (Updating...)')}
              </button>
            )}
          </div>
        ))}
        {equipment.length === 0 && <p>No equipment available currently.</p>}
      </div>
    </div>
  );
};

export default Equipment;
