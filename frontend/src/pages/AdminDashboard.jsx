import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ fertilizers: 0, equipment: 0, pests: 0 });
  const [users, setUsers] = useState([]);
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [fertRes, eqRes, pestsRes] = await Promise.all([
           axios.get(`${API_BASE_URL}/fertilizers`),
           axios.get(`${API_BASE_URL}/equipment`),
           axios.get(`${API_BASE_URL}/pests`)
        ]);
        
        setStats({
          fertilizers: fertRes.data.length,
          equipment: eqRes.data.length,
          pests: pestsRes.data.length
        });
        
        // Mocking user fetch - In reality, build an Admin User route
        setUsers([
          { _id: '1', name: 'John Doe', role: 'farmer', isVerified: true },
          { _id: '2', name: 'Dealer XYZ', role: 'dealer', isVerified: true }
        ]);

      } catch (err) {
        console.error('Admin fetch error', err);
      }
    };
    fetchAdminData();
  }, [navigate, user.role]);

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>System Administration</h2>
        <Link to="/add-listing" className="btn btn-secondary">
          + Add New Listing
        </Link>
      </div>
      
      <div className="grid grid-3" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid var(--primary)' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary)' }}>{stats.fertilizers}</h1>
          <p>Active Fertilizer Listings</p>
        </div>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid var(--secondary)' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--secondary)' }}>{stats.equipment}</h1>
          <p>Available Equipment</p>
        </div>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid red' }}>
          <h1 style={{ fontSize: '3rem', color: 'red' }}>{stats.pests}</h1>
          <p>Community Pest Alerts</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Registered Users Management</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(46, 125, 50, 0.1)', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Role</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{u.name}</td>
                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.role}</td>
                <td style={{ padding: '12px' }}>{u.isVerified ? 'Verified OTP' : 'Pending'}</td>
                <td style={{ padding: '12px' }}>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
