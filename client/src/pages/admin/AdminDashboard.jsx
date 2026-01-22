import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="admin-dashboard">
            <div className="container">
                <h1 className="admin-title">Admin Dashboard</h1>
                <p className="admin-welcome">Welcome back, {user?.name}!</p>

                <div className="admin-cards">
                    <Link to="/admin/products" className="admin-card card">
                        <div className="admin-card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                        </div>
                        <h3>Product Management</h3>
                        <p>Add, edit, and delete products. Upload images and videos.</p>
                    </Link>

                    <Link to="/admin/orders" className="admin-card card">
                        <div className="admin-card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <h3>Order Management</h3>
                        <p>View and manage customer orders and update order status.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
