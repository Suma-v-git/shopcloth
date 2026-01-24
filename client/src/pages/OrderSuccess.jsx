import { Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
    return (
        <div className="order-success-page">
            <div className="container">
                <div className="success-content fade-in">
                    <div className="success-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h1 className="gold-text">Order Placed Successfully!</h1>
                    <p>Thank you for shopping with Tatva Fashion House. Your order has been confirmed and is being processed.</p>
                    <div className="success-actions">
                        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                        <Link to="/profile" className="btn btn-secondary">View My Orders</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
