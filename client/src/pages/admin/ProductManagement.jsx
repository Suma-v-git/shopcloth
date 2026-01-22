import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './ProductManagement.css';

const ProductManagement = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        productId: '',
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'Men',
        sizes: [],
        stock: '',
        images: [],
        video: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (files, type = 'images') => {
        setUploading(true);
        const formDataUpload = new FormData();

        Array.from(files).forEach(file => {
            formDataUpload.append('files', file);
        });

        try {
            const response = await api.post('/products/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (type === 'images') {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...response.data.urls]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    video: response.data.urls[0]
                }));
            }

            setMessage('Files uploaded successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Upload error:', error);
            setMessage('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
                stock: Number(formData.stock)
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, productData);
                setMessage('Product updated successfully!');
            } else {
                await api.post('/products', productData);
                setMessage('Product created successfully!');
            }

            resetForm();
            fetchProducts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving product:', error);
            setMessage(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        console.log('Edit clicked:', product);
        setEditingProduct(product);
        setFormData({
            productId: product.productId || '',
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice || '',
            category: product.category,
            sizes: product.sizes,
            stock: product.stock,
            images: product.images,
            video: product.video || ''
        });
        setShowForm(true);
    };


    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.delete(`/products/${id}`);
            setMessage('Product deleted successfully!');
            fetchProducts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage('Failed to delete product');
        }
    };

    const resetForm = () => {
        setFormData({
            productId: '',
            name: '',
            description: '',
            price: '',
            originalPrice: '',
            category: 'Men',
            sizes: [],
            stock: '',
            images: [],
            video: ''
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="product-management">
            <div className="container">
                <div className="admin-header">
                    <h1>Product Management</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary"
                    >
                        {showForm ? 'Cancel' : '+ Add Product'}
                    </button>
                </div>

                {message && (
                    <div className={message.includes('success') ? 'success-message' : 'error-message'}>
                        {message}
                    </div>
                )}

                {showForm && (
                    <div className="product-form card">
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product ID (Visible to users)</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    placeholder="e.g. HANU-001"
                                />
                            </div>

                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="input"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Original Price (₹) - Optional</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                        placeholder="e.g. 899"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        className="input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Sizes</label>
                                <div className="size-selector">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            className={`size-btn ${formData.sizes.includes(size) ? 'active' : ''}`}
                                            onClick={() => toggleSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Product Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e.target.files, 'images')}
                                    className="input"
                                />
                                {uploading && <p className="text-muted">Uploading...</p>}

                                {formData.images.length > 0 && (
                                    <div className="image-preview-grid">
                                        {formData.images.map((url, index) => (
                                            <div key={index} className="image-preview">
                                                <img src={url} alt={`Product ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="remove-image-btn"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Product Video (Optional)</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileUpload(e.target.files, 'video')}
                                    className="input"
                                />
                                {formData.video && (
                                    <div className="video-preview">
                                        <video src={formData.video} controls width="300" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, video: '' })}
                                            className="btn btn-secondary btn-sm mt-sm"
                                        >
                                            Remove Video
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary btn-lg">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                                <button type="button" onClick={resetForm} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="products-table">
                    <h2>All Products</h2>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Product ID</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Original</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>
                                                <img src={product.images[0]} alt={product.name} className="table-image" />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.productId || '-'}</td>
                                            <td>{product.category}</td>
                                            <td>₹{product.price.toLocaleString()}</td>
                                            <td>{product.originalPrice ? `₹${product.originalPrice.toLocaleString()}` : '-'}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="btn btn-secondary btn-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="btn btn-sm"
                                                        style={{ background: 'var(--color-error)' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-muted">No products yet. Add your first product!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
