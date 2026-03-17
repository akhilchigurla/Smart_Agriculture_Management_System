import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/fertilizers/bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchBookings();
    }, [token]);

    const filteredBookings = bookings.filter(b => {
        const name = (b.fertilizer?.name || b.equipment?.name || '').toLowerCase();
        return name.includes(searchTerm.toLowerCase()) || b._id.includes(searchTerm);
    });

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
    };

    const getValidUntil = (dateStr) => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + 1); // 1 day validity for demo
        return formatDate(d);
    };

    return (
        <div className="bookings-bg">
            <div className="dept-header">
                <div className="dept-logo-mock">GA</div>
                <div>
                    <div style={{ fontWeight: '700', fontSize: '18px' }}>DePartMent of</div>
                    <div style={{ fontWeight: '700', fontSize: '18px' }}>AgricuLture</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
                    <span style={{ fontSize: '24px' }}>←</span>
                    <span style={{ fontSize: '24px' }}>→</span>
                </div>
            </div>

            <h2 className="history-title">Bookings History</h2>

            <div className="search-container-custom">
                <input 
                    type="text" 
                    placeholder="TyPe to search..." 
                    className="search-input-custom"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ borderBottom: '1px solid #ddd', margin: '0 20px' }}></div>

            {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> : (
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {filteredBookings.map(b => {
                        const product = b.fertilizer || b.equipment;
                        const dealerName = b.fertilizer ? product.shopName : (product.addedBy?.name || 'Local Provider');
                        
                        // Reference image style address construction
                        const address = `${product.village} Village, ${product.mandal}, ${product.district}`;
                        
                        // Generate a consistent "random" looking ID based on the DB ID
                        // We use a simple hash of the ID to get a 10-digit number
                        const idHash = b._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const randomNum = (idHash * 1234567).toString().substring(0, 10);
                        const bookingId = `KJ${randomNum}`;

                        return (
                            <div key={b._id} className="booking-card-custom">
                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#4a148c', marginBottom: '10px' }}>
                                    {product.name.toUpperCase()}
                                </div>
                                <div className="booking-id-text">Booking ID: {bookingId}</div>
                                <div className="booking-detail-row">Date: {formatDate(b.createdAt)}</div>
                                {b.fertilizer && <div className="booking-detail-row">Valid Until: {getValidUntil(b.createdAt)}</div>}
                                <div style={{ height: '10px' }}></div>
                                <div className="booking-detail-row">Dealer: {dealerName.toUpperCase()}</div>
                                <div className="booking-detail-row">Address: {address}</div>
                                
                                <div style={{ height: '10px' }}></div>
                                <div className="booking-detail-row">
                                    {b.fertilizer ? `Bags Booked: ${b.bagsBooked}` : `Hours Booked: ${b.rentalHours}`}
                                    <span className="status-booked-text">Status: Booked</span>
                                </div>
                                <div className="booking-detail-row">
                                    {b.fertilizer ? 'Bags Purchased: 0' : `Total Price: ₹${b.totalPrice}`}
                                </div>
                            </div>
                        );
                    })}
                    {filteredBookings.length === 0 && (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>No matching bookings found.</p>
                    )}
                </div>
            )}
            
        </div>
    );
};

export default MyBookings;
