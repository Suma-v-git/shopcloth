# 🚀 ShopCloth - Quick Setup Guide

## Step 1: Configure Environment Variables

Your `.env` file needs to be configured with the following credentials:

### 1️⃣ MongoDB Atlas (Database)

**Get your connection string:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account (if you don't have one)
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Add `/shopcloth` at the end

**Example:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shopcloth
```

### 2️⃣ JWT Secret (Already Generated)

A secure random JWT secret has been generated for you. You can use it as-is or generate a new one.

### 3️⃣ Cloudinary (Image/Video Storage)

**Get your credentials:**
1. Go to https://cloudinary.com/users/register/free
2. Create a free account
3. Go to Dashboard
4. Copy these three values:
   - Cloud Name
   - API Key
   - API Secret

**Example:**
```
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

---

## Step 2: Create Admin User

After setting up MongoDB Atlas, you need to create an admin user:

### Option A: Create via Signup, then Upgrade to Admin

1. Start the application (see Step 3)
2. Sign up as a regular user at http://localhost:5173/signup
3. Go to MongoDB Atlas → Browse Collections
4. Find the `users` collection
5. Find your user document
6. Click "Edit" and change `"role": "user"` to `"role": "admin"`
7. Save the document
8. Log out and log back in
9. Navigate to http://localhost:5173/admin

### Option B: Create Admin User Directly in MongoDB

1. Go to MongoDB Atlas → Browse Collections
2. Select `shopcloth` database → `users` collection
3. Click "Insert Document"
4. Use this template (replace email/password):

```json
{
  "name": "Admin",
  "email": "admin@shopcloth.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "createdAt": {"$date": "2026-01-20T00:00:00.000Z"}
}
```

**To hash your password:**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_password', 10).then(hash => console.log(hash));"
```

---

## Step 3: Run the Application

### Install Dependencies (if not done):
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### Start the Application:

**Option 1: Run both frontend and backend together (Recommended)**
```bash
npm run dev:all
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## Step 4: Access the Application

- **Frontend (User Site)**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Admin Dashboard**: http://localhost:5173/admin (hidden, not linked)

---

## 🎯 Quick Test Checklist

### User Flow:
- [ ] Visit homepage and see products (will be empty initially)
- [ ] Sign up as a new user
- [ ] Browse products (after admin adds some)
- [ ] View product details
- [ ] Add to cart
- [ ] Checkout

### Admin Flow:
- [ ] Navigate to `/admin`
- [ ] Login with admin credentials
- [ ] Go to Product Management
- [ ] Add a new product with images
- [ ] Upload works and shows Cloudinary URLs
- [ ] Product appears on homepage
- [ ] View orders in Order Management

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas (Network Access)
- Verify database user credentials

### "Cloudinary upload failed"
- Verify all three Cloudinary credentials in `.env`
- Check file size (max 10MB)
- Ensure file types are images or videos

### "Access denied" on /admin
- Verify user has `role: "admin"` in database
- Log out and log back in after changing role
- Check JWT token is valid

---

## 📚 Next Steps

1. Configure your `.env` file with real credentials
2. Create an admin user
3. Start the application
4. Upload your first products!
5. Test the complete user flow

**Need help?** Check the [README.md](file:///c:/shopcloth/README.md) for detailed documentation.

---

**Happy Shopping! 🛍️**
