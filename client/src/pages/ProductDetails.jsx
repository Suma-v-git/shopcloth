import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.product);
            if (response.data.product.sizes.length > 0) {
                setSelectedSize(response.data.product.sizes[0]);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setMessage('Please select a size');
            return;
        }

        addToCart(product, selectedSize, quantity);
        setMessage('Added to cart!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handlePrevImage = () => {
        setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            await api.post(`/products/${product._id}/reviews`, {
                rating,
                comment
            });
            setMessage('Review submitted successfully');
            setComment('');
            setRating(5);
            fetchProduct();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmittingReview(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-3xl">
                <h2>Product not found</h2>
            </div>
        );
    }

    return (
        <div className="product-details">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← Back
                </button>

                <div className="product-layout">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="sale-badge">Sale</span>
                            )}
                            <img src={product.images[selectedImage]} alt={product.name} />

                            {product.images.length > 1 && (
                                <>
                                    <button className="slider-btn prev" onClick={handlePrevImage}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                    </button>
                                    <button className="slider-btn next" onClick={handleNextImage}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="slider-dots">
                                {product.images.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`slider-dot ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                ))}
                            </div>
                        )}

                        {product.images.length > 1 && (
                            <div className="image-thumbnails">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {product.video && (
                            <div className="product-video">
                                <video controls>
                                    <source src={product.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-category">{product.category}</p>
                        <div className="product-price-row">
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="product-original-price">
                                    ₹{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                            <span className="product-price">₹{product.price.toLocaleString()}</span>
                        </div>
                        <div className="product-rating-overview">
                            <span className="star-rating" style={{ color: '#fbbf24' }}>
                                {'★'.repeat(Math.round(product.rating || 0)) + '☆'.repeat(5 - Math.round(product.rating || 0))}
                            </span>
                            <span style={{ marginLeft: '8px', color: 'var(--color-text-secondary)' }}>
                                ({product.numReviews} reviews)
                            </span>
                        </div>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Reviews Section */}
                        <div className="product-reviews">
                            <h3>Reviews ({product.numReviews})</h3>
                            <div className="rating-summary">
                                <span className="star-rating">
                                    {'★'.repeat(Math.round(product.rating || 0)) + '☆'.repeat(5 - Math.round(product.rating || 0))}
                                </span>
                                <span> {product.rating ? product.rating.toFixed(1) : 'No ratings'}</span>
                            </div>

                            {user ? (
                                <form onSubmit={handleReviewSubmit} className="review-form">
                                    <h4>Write a Review</h4>
                                    <div className="form-group">
                                        <label>Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            className="input"
                                        >
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="input"
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                                        Submit Review
                                    </button>
                                </form>
                            ) : (
                                <div className="login-to-review">
                                    Please <a href="/login">login</a> to write a review.
                                </div>
                            )}

                            <div className="reviews-list">
                                {product.reviews && product.reviews.map((review) => (
                                    <div key={review._id} className="review-item">
                                        <div className="review-header">
                                            <strong>{review.name}</strong>
                                            <span className="star-rating-sm">
                                                {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                                            </span>
                                            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="size-selection">
                            <h3>Select Size</h3>
                            <div className="size-options">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="quantity-selection">
                            <h3>Quantity</h3>
                            <div className="quantity-controls">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="btn btn-secondary"
                                >
                                    -
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="btn btn-secondary"
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </button>
                            </div>
                            <p className="stock-info">
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-primary btn-lg add-to-cart-btn"
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProductDetails;
