import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const orderData = {
                products: cart.map(item => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                    size: item.size
                })),
                shippingAddress: formData
            };

            await api.post('/orders', orderData);
            clearCart();
            navigate('/order-success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <div className="checkout-layout">
                    <div className="checkout-form-section">
                        <div className="card">
                            <h2>Shipping Information</h2>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="checkout-form">
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        className="input"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        className="input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        className="input"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            className="input"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="state">State</label>
                                        <input
                                            id="state"
                                            name="state"
                                            type="text"
                                            className="input"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="zipCode">ZIP Code</label>
                                        <input
                                            id="zipCode"
                                            name="zipCode"
                                            type="text"
                                            className="input"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="order-summary-section">
                        <div className="card">
                            <h2>Order Summary</h2>

                            <div className="order-items">
                                {cart.map((item) => (
                                    <div key={`${item.product._id}-${item.size}`} className="order-item">
                                        <img src={item.product.images[0]} alt={item.product.name} />
                                        <div className="order-item-details">
                                            <h4>{item.product.name}</h4>
                                            <p>Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                        <div className="order-item-price">
                                            ₹{(item.product.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{getCartTotal().toLocaleString()}</span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{getCartTotal().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
