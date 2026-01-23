import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // Search Suggestions State
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const searchRef = useRef(null);

    const TOP_SEARCHES = [
        'Suits', 'Blazers', 'Formal Shirts', 'Tuxedo', 'Leather Shoes',
        'Cufflinks', 'Trousers', 'Premium T-shirts', 'Oversized Tees', 'Jackets',
        'Denim', 'Luxury Watches'
    ];

    useEffect(() => {
        // Load recent searches on mount
        const savedRecents = localStorage.getItem('recentSearches');
        if (savedRecents) {
            setRecentSearches(JSON.parse(savedRecents));
        }

        // Click outside handler
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addToRecentSearches = (term) => {
        if (!term.trim()) return;

        const updatedRecents = [
            term,
            ...recentSearches.filter(item => item !== term)
        ].slice(0, 5); // Keep last 5

        setRecentSearches(updatedRecents);
        localStorage.setItem('recentSearches', JSON.stringify(updatedRecents));
    };

    const handleSuggestionClick = (term) => {
        setSearch(term);
        setShowSuggestions(false);
        addToRecentSearches(term);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500); // Debounce search for 500ms

        return () => clearTimeout(timeoutId);
    }, [search, selectedCategory, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                sort: sortBy // Pass sort parameter
            };

            if (selectedCategory) params.category = selectedCategory;


            if (search) params.search = search;
            if (priceRange.min) params.minPrice = priceRange.min;
            if (priceRange.max) params.maxPrice = priceRange.max;

            const response = await api.get('/products', { params });
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePriceFilter = (e) => {
        e.preventDefault();
        fetchProducts(); // Trigger fetch on price submit
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category) {
            setSearchParams({ category });
        } else {
            setSearchParams({});
        }
    };

    // Client-side search filtering removed as searching is now done via API
    const filteredProducts = products;

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            <span className="gold-text">Tatva Fashion House</span>
                        </h1>
                        <p className="hero-subtitle">
                            Where tradition meets modern style.<br />
                            Discover premium men’s wear crafted for confidence, comfort, and class.
                        </p>
                        <div className="hero-actions">
                            <a href="#products" className="btn btn-primary btn-lg">
                                Shop Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="filters" id="products">
                <div className="container">
                    <div className="search-bar" ref={searchRef}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by Keyword or Product ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            className="input search-input"
                        />

                        {/* Search Suggestions Overlay */}
                        {showSuggestions && (
                            <div className="search-suggestions">
                                {recentSearches.length > 0 && (
                                    <div className="suggestions-section">
                                        <h4 className="suggestions-title">Your Recent Searches</h4>
                                        <div className="recent-list">
                                            {recentSearches.map((term, index) => (
                                                <div
                                                    key={index}
                                                    className="recent-item"
                                                    onClick={() => handleSuggestionClick(term)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg>
                                                    {term}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="suggestions-section">
                                    <h4 className="suggestions-title">Top Searches</h4>
                                    <div className="popular-tags">
                                        {TOP_SEARCHES.map((tag, index) => (
                                            <div
                                                key={index}
                                                className="popular-tag"
                                                onClick={() => handleSuggestionClick(tag)}
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="filter-controls">
                        <form onSubmit={handlePriceFilter} className="price-filter">
                            <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Price:</span>
                            <input
                                type="number"
                                placeholder="Min"
                                className="price-input"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            />
                            <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="price-input"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            />
                            <button type="submit" className="btn btn-sm btn-outline">Go</button>
                        </form>

                        <div className="sort-filter">
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="products-section">
                <div className="container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
