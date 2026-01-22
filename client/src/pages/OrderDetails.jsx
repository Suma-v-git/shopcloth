import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import './Profile.css'; // Shared styles

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data.order);
            } catch (err) {
                setError('Failed to fetch order details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="container py-3xl text-center">Loading...</div>;
    if (error) return <div className="container py-3xl text-center text-error">{error}</div>;
    if (!order) return <div className="container py-3xl text-center">Order not found</div>;

    const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentStepIndex = steps.indexOf(order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <div className="order-details-page">
            <div className="container">
                <div className="order-header">
                    <Link to="/profile" className="back-link">← Back to Orders</Link>
                    <h1 className="page-title">Order #{order._id.slice(-6).toUpperCase()}</h1>
                    <span className={`status-badge status-${order.status} large`}>
                        {order.status}
                    </span>
                </div>

                {!isCancelled && (
                    <div className="tracking-container">
                        <div className="progress-track">
                            {steps.map((step, index) => (
                                <div
                                    key={step}
                                    className={`track-step ${index <= currentStepIndex ? 'completed' : ''} ${index === currentStepIndex ? 'active' : ''}`}
                                >
                                    <div className="step-icon">
                                        {index < currentStepIndex ? '✓' : index + 1}
                                    </div>
                                    <span className="step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="order-content-grid">
                    <div className="order-items-card">
                        <h3>Items</h3>
                        <div className="items-list">
                            {order.products.map((item, index) => (
                                <div key={index} className="order-item-row">
                                    <div className="item-details">
                                        <h4>{item.product?.name || 'Product unavailable'}</h4>
                                        <p>Size: {item.size} | Qty: {item.quantity}</p>
                                    </div>
                                    <div className="item-price">
                                        ₹{item.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-summary-footer">
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="shipping-info-card">
                        <h3>Shipping Details</h3>
                        <div className="info-group">
                            <p className="info-label">Address</p>
                            <p className="info-value">{order.shippingAddress.fullName}</p>
                            <p className="info-value">{order.shippingAddress.address}</p>
                            <p className="info-value">
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                        </div>
                        <div className="info-group">
                            <p className="info-label">Contact</p>
                            <p className="info-value">{order.shippingAddress.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
