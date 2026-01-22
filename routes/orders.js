import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', verifyToken, async (req, res) => {
    try {
        const { products, shippingAddress } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one product'
            });
        }

        // Validate products and calculate total
        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
                size: item.size,
                price: product.price
            });

            totalAmount += product.price * item.quantity;

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            user: req.user._id,
            products: orderProducts,
            totalAmount,
            shippingAddress
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
});

// @route   GET /api/orders/user/:userId
// @desc    Get orders for a specific user
// @access  Private
router.get('/user/:userId', verifyToken, async (req, res) => {
    try {
        // Users can only view their own orders
        if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const orders = await Order.find({ user: req.params.userId })
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order'
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private (Owner or Admin)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('products.product')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check ownership or admin status
        if (req.user._id.toString() !== order.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get single order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order'
        });
    }
});

export default router;
