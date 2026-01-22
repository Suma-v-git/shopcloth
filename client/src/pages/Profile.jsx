import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css'; // We'll create this check

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get(`/orders/user/${user.id || user._id}`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="container">
                <h1 className="page-title">My Profile</h1>

                <div className="profile-grid">
                    {/* User Info Card */}
                    <div className="profile-card">
                        <div className="user-info-header">
                            <div className="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="user-name">{user.name}</h2>
                                <p className="user-email">{user.email}</p>
                                {user.phone && <p className="user-phone">{user.phone}</p>}
                            </div>
                        </div>
                    </div>
                    {user.role === 'admin' && (
                        <div className="admin-actions" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                            <Link to="/admin" className="btn btn-primary" style={{ width: '100%' }}>
                                Go to Admin Dashboard
                            </Link>
                        </div>
                    )}
                </div>

                {/* Orders Section */}
                {(!user || user.role !== 'admin') && (
                    <div className="orders-section">
                        <h2 className="section-title">My Orders</h2>
                        {loading ? (
                            <div className="loading-spinner">Loading orders...</div>
                        ) : orders.length > 0 ? (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order._id} className="order-item">
                                        <div className="order-info">
                                            <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                                            <span className="order-date">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className={`status-badge status-${order.status}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="order-total">
                                            ₹{order.totalAmount}
                                        </div>
                                        <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline">
                                            View Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-orders">
                                <p>You haven't placed any orders yet.</p>
                                <Link to="/" className="btn btn-primary">Start Shopping</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
