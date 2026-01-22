# ShopCloth E-commerce Platform

A professional Amazon-like clothing e-commerce website with user shopping experience and hidden admin product management.

## 🚀 Features

### For Users:
- Browse products with category filters and search
- View product details with image gallery and videos
- Add products to cart with size selection
- Secure checkout process
- User authentication (signup/login)

### For Admin (Hidden):
- Secret admin dashboard at `/admin` route
- Upload products with multiple images and videos to Cloudinary
- Manage products (add, edit, delete)
- View and manage all orders
- Update order status

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Media Storage**: Cloudinary
- **Authentication**: JWT with role-based access

## 📋 Prerequisites

Before running this project, you need:

1. **Node.js** (v18 or higher)
2. **MongoDB Atlas Account** (free tier)
3. **Cloudinary Account** (free tier)

## ⚙️ Setup Instructions

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add `/shopcloth` at the end of the connection string

### 2. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/users/register/free)
2. Create a free account
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/shopcloth

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Port
PORT=5000
```

### 4. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 5. Create Admin User

You need to manually create an admin user in MongoDB Atlas:

1. Go to MongoDB Atlas → Browse Collections
2. Select your database → `users` collection
3. Click "Insert Document"
4. Add this document (replace with your details):

```json
{
  "name": "Admin",
  "email": "admin@shopcloth.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "createdAt": {"$date": "2026-01-20T00:00:00.000Z"}
}
```

**Important**: For the password, you need to hash it first. Run this in a Node.js console:

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your_password', 10);
console.log(hash);
```

Or create a regular user account first via signup, then manually change the `role` to `"admin"` in MongoDB Atlas.

## 🚀 Running the Application

### Development Mode

Run both backend and frontend concurrently:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Admin Dashboard**: http://localhost:5173/admin (hidden, not linked anywhere)

## 🔐 Admin Access

The admin dashboard is **hidden** and not linked anywhere on the website. To access it:

1. Navigate directly to: `http://localhost:5173/admin`
2. Login with your admin credentials
3. You'll be redirected to the admin dashboard

## 📝 Usage Guide

### For Users:

1. Browse products on the home page
2. Click on a product to view details
3. Select size and quantity, add to cart
4. Go to cart and proceed to checkout
5. Fill in shipping information and place order

### For Admin:

1. Navigate to `/admin`
2. Login with admin credentials
3. **Product Management**:
   - Click "Add Product"
   - Fill in product details
   - Upload images (multiple) and video (optional)
   - Files are automatically uploaded to Cloudinary
   - Click "Create Product"
4. **Order Management**:
   - View all customer orders
   - Update order status (pending → confirmed → shipped → delivered)

## 🎨 Design Features

- Modern dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations and micro-interactions
- Fully responsive design
- Premium, professional aesthetics

## 📂 Project Structure

```
shopcloth/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth & Cart context
│   │   ├── pages/         # User pages
│   │   │   └── admin/     # Admin pages
│   │   ├── utils/         # API utilities
│   │   └── index.css      # Design system
│   └── package.json
├── models/                # MongoDB schemas
├── routes/                # Express routes
├── middleware/            # Auth middleware
├── server.js              # Express server
├── .env                   # Environment variables
└── package.json
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Hidden admin URL
- Input validation

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check your connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user credentials

### Cloudinary Upload Error
- Verify Cloudinary credentials in `.env`
- Check file size limits (10MB max)
- Ensure proper file types (images/videos)

### Admin Access Denied
- Verify user role is set to "admin" in database
- Check JWT token is valid
- Ensure you're logged in with admin account

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

**Happy Shopping! 🛍️**
