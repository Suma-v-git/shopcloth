import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <div className="container">
                    <div className="empty-cart-content">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started!</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary btn-lg">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={`${item.product._id}-${item.size}`} className="cart-item card">
                                <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="cart-item-image"
                                />

                                <div className="cart-item-details">
                                    <h3>{item.product.name}</h3>
                                    <p className="cart-item-category">{item.product.category}</p>
                                    <p className="cart-item-size">Size: {item.size}</p>
                                    <p className="cart-item-price">₹{item.product.price.toLocaleString()}</p>
                                </div>

                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                                            className="btn btn-secondary btn-sm"
                                            disabled={item.quantity >= item.product.stock}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.product._id, item.size)}
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="cart-item-total">
                                    ₹{(item.product.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary card">
                        <h2>Order Summary</h2>

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

                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn btn-primary btn-lg checkout-btn"
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={clearCart}
                            className="btn btn-secondary clear-cart-btn"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
