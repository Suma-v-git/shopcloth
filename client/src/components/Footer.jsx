import { useState } from 'react';
import './Footer.css';

const Footer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, phone, message } = formData;

        const whatsappMsg = `New Contact Form Message:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`;

        const encodedMsg = encodeURIComponent(whatsappMsg);
        const whatsappUrl = `https://wa.me/918722888444?text=${encodedMsg}`;

        window.open(whatsappUrl, '_blank');

        // Clear form after submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">Contact form</h3>
                        <form className="footer-contact-form" onSubmit={handleSubmit}>
                            <input
                                className="input"
                                type="text"
                                name="name"
                                placeholder="Name *"
                                required
                                style={{ marginBottom: '8px' }}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <input
                                className="input"
                                type="email"
                                name="email"
                                placeholder="Email *"
                                required
                                style={{ marginBottom: '8px' }}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                className="input"
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                style={{ marginBottom: '8px' }}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <textarea
                                className="input"
                                name="message"
                                placeholder="Message *"
                                required
                                rows={3}
                                style={{ marginBottom: '8px' }}
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send message</button>
                        </form>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Info</h4>
                        <div className="footer-accordion">
                            <details>
                                <summary>About us</summary>
                                <div>Tatva Fashion House is a men’s clothing brand dedicated to blending tradition with modern style. We believe true fashion lies in comfort, confidence, and quality. Every piece in our collection is carefully selected and crafted using premium fabrics, ensuring perfect fit, durability, and timeless appeal. From everyday essentials to elegant occasion wear, Tatva Fashion House is designed for men who value authenticity, sophistication, and effortless style.</div>
                            </details>
                            <details>
                                <summary>Privacy & policy</summary>
                                <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                                    <strong>Privacy Policy</strong>
                                    <p style={{ marginTop: '8px', marginBottom: '12px' }}>At Tatva Fashion House, your privacy is important to us. We are committed to protecting the personal information you share while using our website.</p>
                                    <p style={{ marginBottom: '12px' }}>We collect basic information such as name, contact details, shipping address, and payment-related information only to process orders, provide customer support, and improve our services. Your data is used strictly for business purposes and is never sold, traded, or shared with third parties, except when required to complete transactions or comply with legal obligations.</p>
                                    <p style={{ marginBottom: '16px' }}>We use secure technologies to protect your information and ensure safe online transactions. By using our website, you agree to our privacy practices as outlined in this policy.</p>

                                    <strong>Store Policy</strong>
                                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '8px' }}>
                                        <li style={{ marginBottom: '8px' }}><strong>Product Information:</strong> We make every effort to display accurate product descriptions, prices, and images. However, slight variations in color or design may occur due to lighting or screen settings.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Orders & Payments:</strong> All orders are subject to availability and confirmation. Payments must be completed through the available secure payment methods on our website.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Shipping Policy:</strong> Orders are processed within a reasonable timeframe after confirmation. Delivery times may vary based on location and external factors. Tatva Fashion House is not responsible for delays caused by courier services.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Return & Exchange Policy:</strong> Returns or exchanges are accepted only for damaged or incorrect items, subject to verification. Requests must be made within a specified time after delivery. Items must be unused and in original condition.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Cancellation Policy:</strong> Order cancellations are accepted only before the order is shipped. Once dispatched, cancellations may not be possible.</li>
                                    </ul>
                                </div>
                            </details>
                            <details>
                                <summary>FAQs</summary>
                                <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        <li style={{ marginBottom: '12px' }}>
                                            <strong>1. What products does Tatva Fashion House offer?</strong><br />
                                            We offer premium men’s clothing, including casual, formal, and traditional wear designed for comfort and style.
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <strong>2. What payment methods are accepted?</strong><br />
                                            We accept secure online payment options such as UPI, debit cards, credit cards, and other supported methods.
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <strong>3. How long does delivery take?</strong><br />
                                            Delivery time varies by location and is usually completed within a few business days after dispatch.
                                        </li>
                                        <li style={{ marginBottom: '12px' }}>
                                            <strong>4. What is your return or exchange policy?</strong><br />
                                            Returns or exchanges are accepted only for damaged or incorrect items, subject to verification and policy terms.
                                        </li>
                                        <li style={{ marginBottom: '8px' }}>
                                            <strong>5. Is my personal information safe?</strong><br />
                                            Yes, we use secure systems to protect your data and ensure safe transactions.
                                        </li>
                                    </ul>
                                </div>
                            </details>
                            <details>
                                <summary>Shipping info</summary>
                                <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
                                    <p style={{ marginBottom: '12px' }}>At Tatva Fashion House, we ensure your orders are processed and delivered with care.</p>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        <li style={{ marginBottom: '8px' }}><strong>Order Processing:</strong> Orders are processed within 1–2 business days after confirmation.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Delivery Time:</strong> Delivery typically takes 3–7 business days, depending on your location.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Shipping Charges:</strong> Shipping charges, if applicable, will be calculated and displayed at checkout.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Delivery Locations:</strong> We currently deliver to selected locations. Availability will be shown during checkout.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Delays:</strong> Delivery timelines may be affected by external factors such as weather, holidays, or courier delays.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Order Tracking:</strong> Once your order is shipped, tracking details will be shared via SMS or email.</li>
                                    </ul>
                                    <p style={{ marginTop: '12px' }}>For any shipping-related queries, please contact our customer support through the Contact Us page.</p>
                                </div>
                            </details>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Contact Info</h4>
                        <ul className="footer-contact">
                            <li>Mobile: +91 87228 88444</li>
                            <li>Email: tatvafashionhouse@gmail.com</li>
                            <li>Address: The Thindi Hatti, Next to RS car care, Railway Feeder road, Malur, Kolar-563130</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Connect</h4>
                        <div className="social-links">
                            <a href="https://www.instagram.com/tatva_fashion_house?igsh=MTN0Ym1ieWsyZnVyZQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="mailto:tatvafashionhouse@gmail.com" aria-label="Email" className="social-link">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} <span className="gold-text">Tatva Fashion House</span>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
