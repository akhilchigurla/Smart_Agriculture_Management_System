import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddListing = () => {
  const [type, setType] = useState('fertilizer');
  const [formData, setFormData] = useState({});
  const [phoneError, setPhoneError] = useState('');
  const [telanganaData, setTelanganaData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch the exhaustive location dataset from the public folder
    axios.get('/telangana.json')
      .then(res => setTelanganaData(res.data))
      .catch(err => console.error('Failed to load Telangana location data', err));
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

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, ownerContact: value });
    
    if (value && !/^[6-9]\d{9}$/.test(value)) {
      setPhoneError('Invalid phone number');
    } else {
      setPhoneError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'equipment' && phoneError) {
      alert('Please fix validation errors before submitting');
      return;
    }
    
    try {
      // Add default mock lat/lng coordinates for demo purposes if not provided
      const payload = {
          ...formData,
          location: {
              lat: 17.3850 + (Math.random() * 0.1),
              lng: 78.4867 + (Math.random() * 0.1)
          }
      };

      if (type === 'fertilizer') {
        await axios.post('http://localhost:5001/api/fertilizers', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/fertilizers');
      } else {
        await axios.post('http://localhost:5001/api/equipment', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/equipment');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add listing: ' + (err.response?.data?.error || err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container" style={{ marginTop: '30px', maxWidth: '600px' }}>
      <h2 style={{ color: 'var(--primary-dark)', marginBottom: '20px' }}>Add New Listing</h2>
      
      <div className="glass-panel" style={{ padding: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '15px', fontWeight: 'bold' }}>
            <input type="radio" checked={type === 'fertilizer'} onChange={() => setType('fertilizer')} /> Fertilizer
          </label>
          <label style={{ fontWeight: 'bold' }}>
            <input type="radio" checked={type === 'equipment'} onChange={() => setType('equipment')} /> Equipment
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {type === 'fertilizer' ? (
            <>
              <div className="form-group"><label>Fertilizer Name</label><input type="text" name="name" className="form-control" onChange={handleChange} required /></div>
              <div className="form-group"><label>Upload Photo</label><input type="file" accept="image/*" className="form-control" onChange={handleImageChange} /></div>
              <div className="form-group"><label>Bags Available</label><input type="number" name="bagsAvailable" className="form-control" onChange={handleChange} required /></div>
              <div className="form-group"><label>Price Per Bag (₹)</label><input type="number" name="pricePerBag" className="form-control" onChange={handleChange} required /></div>
              <div className="form-group"><label>Shop Name</label><input type="text" name="shopName" className="form-control" onChange={handleChange} required /></div>
              <div className="grid grid-3">
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
            </>
          ) : (
            <>
              <div className="form-group"><label>Equipment Name (e.g., Tractor)</label><input type="text" name="name" className="form-control" onChange={handleChange} required /></div>
              <div className="form-group"><label>Upload Photo</label><input type="file" accept="image/*" className="form-control" onChange={handleImageChange} /></div>
              <div className="form-group"><label>Rental Price Per Hour (Multiple of ₹100)</label>
                <input type="number" name="rentalPricePerHour" className="form-control" onChange={handleChange} required step="100" min="100" 
                  onInvalid={e => e.target.setCustomValidity('Please enter a price in multiples of ₹100')} 
                  onInput={e => e.target.setCustomValidity('')} />
              </div>
              <div className="form-group">
                <label>Owner Contact Number</label>
                <input type="text" name="ownerContact" className="form-control" onChange={handlePhoneChange} required />
                {phoneError && <small style={{ color: 'red', display: 'block', marginTop: '5px' }}>{phoneError}</small>}
              </div>
              <div className="grid grid-3">
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
            </>
          )}
          
          <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '15px' }}>Add to Marketplace</button>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
