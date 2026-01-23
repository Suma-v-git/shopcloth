import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const displayId = product.productId || product._id;
    const productUrl = `${window.location.origin}/product/${product._id}`;
    const shareMessage = `Check out this product on Tatva Fashion House: ${product.name}`;

    const handleShareClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.name,
                    text: shareMessage,
                    url: productUrl,
                });
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(`${shareMessage} - ${productUrl}`);
                alert('Product link copied to clipboard');
            } else {
                alert(`${shareMessage} - ${productUrl}`);
            }
        } catch (error) {
            console.error('Error sharing product:', error);
        }
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-image-wrapper">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />
                {product.stock === 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-id">ID: {displayId}</p>
                <div className="product-rating-sm">
                    <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                        {'★'.repeat(Math.round(product.rating || 0)) + '☆'.repeat(5 - Math.round(product.rating || 0))}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '4px' }}>
                        ({product.numReviews})
                    </span>
                </div>
                <div className="product-footer">
                    <div className="product-price-block">
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="product-original-price-sm">
                                ₹{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                        <span className="product-price">₹{product.price.toLocaleString()}</span>
                    </div>
                    <div className="product-footer-right">
                        <span className="product-stock">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                        <button
                            type="button"
                            className="share-button"
                            onClick={handleShareClick}
                            aria-label="Share product"
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
