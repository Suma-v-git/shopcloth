import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import './Header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <span className="logo-text">Shop</span>
                        <span className="logo-accent">Cloth</span>
                    </Link>

                    <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
                        <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                            Home
                        </Link>
                        {(!user || user.role !== 'admin') && (
                            <Link to="/cart" className="nav-link cart-link" onClick={() => setMobileMenuOpen(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                Cart
                                {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
                            </Link>
                        )}


                        {user ? (
                            <div className="user-dropdown-container">
                                <button
                                    className="nav-link user-menu-btn"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span>Hi, {user.name.split(' ')[0]}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="user-dropdown-menu">
                                        <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            My Profile
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                Dashboard
                                            </Link>
                                        )}
                                        {(!user || user.role !== 'admin') && (
                                            <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                My Orders
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="dropdown-item text-error">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
