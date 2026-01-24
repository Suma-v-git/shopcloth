# 🚀 Deploying to Netlify (All-in-One)

Follow these steps to deploy both your frontend and backend to Netlify.

### 1. Push code to GitHub
Make sure all your changes (including the new `functions/` folder and `netlify.toml`) are pushed to your GitHub repository.

### 2. Connect to Netlify
1. Go to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** → **Import an existing project**.
3. Select **GitHub** and choose your `shopcloth` repository.

### 3. Configure Build Settings
Netlify should automatically detect the settings from `netlify.toml`. Verify they match:
- **Build command**: `cd client && npm install && npm run build`
- **Publish directory**: `client/dist`
- **Functions directory**: `functions`

### 4. Set Environment Variables
Go to **Site configuration** → **Environment variables** and add the following from your `.env` file:

| Variable | Value |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your secure random string |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret |
| `PORT` | 5000 (standard, though Netlify manages this) |

### 5. Deploy!
- Click **Deploy site**.
- Once finished, your website will be live at a custom `.netlify.app` URL.
- Both the website and the API (via `/api`) will work from this single URL.

---
**Note**: Since your backend runs as a Netlify Function, it might have a "cold start" (slight delay) on the very first request if the site hasn't been visited for a while.
