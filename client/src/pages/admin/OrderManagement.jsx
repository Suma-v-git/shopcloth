import { useState, useEffect } from 'react';
import api from '../../utils/api';
import './OrderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}`, { status: newStatus });
            setMessage('Order status updated successfully!');
            fetchOrders();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error updating order:', error);
            setMessage('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'var(--color-warning)',
            confirmed: 'var(--color-primary)',
            shipped: 'var(--color-accent)',
            delivered: 'var(--color-success)',
            cancelled: 'var(--color-error)'
        };
        return colors[status] || 'var(--color-text-muted)';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="order-management">
            <div className="container">
                <h1>Order Management</h1>

                {message && (
                    <div className={message.includes('success') ? 'success-message' : 'error-message'}>
                        {message}
                    </div>
                )}

                {orders.length > 0 ? (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order._id} className="order-card card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order._id.slice(-8)}</h3>
                                        <p className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                                        {order.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="order-customer">
                                    <h4>Customer Details</h4>
                                    <p><strong>Name:</strong> {order.user?.name || 'N/A'}</p>
                                    <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                                    {order.shippingAddress && (
                                        <>
                                            <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                                            <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                                        </>
                                    )}
                                </div>

                                <div className="order-products">
                                    <h4>Products</h4>
                                    {order.products.map((item, index) => (
                                        <div key={index} className="order-product-item">
                                            <img src={item.product?.images?.[0]} alt={item.product?.name} />
                                            <div className="order-product-details">
                                                <p><strong>{item.product?.name || 'Product'}</strong></p>
                                                <p>Size: {item.size} | Qty: {item.quantity}</p>
                                                <p>₹{item.price?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <strong>Total:</strong> ₹{order.totalAmount.toLocaleString()}
                                    </div>

                                    <div className="order-actions">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className="input"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted">No orders yet.</p>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
