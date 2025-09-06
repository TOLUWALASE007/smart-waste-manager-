# 🚀 Railway Backend Deployment Guide

## Step-by-Step Railway Deployment

### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your email if required

### **Step 2: Create New Project**
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `smart-waste-manager-` repository
4. Railway will detect it's a monorepo

### **Step 3: Configure Backend Service**
1. Railway will show you the repository structure
2. Click **"Add Service"** → **"GitHub Repo"**
3. Select your repository again
4. In the service settings:
   - **Root Directory**: `wte-backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### **Step 4: Add Database**
1. In your project dashboard, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"** (or MySQL if available)
3. Railway will create a database and provide connection details

### **Step 5: Configure Environment Variables**
1. Go to your backend service
2. Click **"Variables"** tab
3. Add these environment variables:

```
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
DATABASE_URL=postgresql://username:password@host:port/database
PORT=4000
```

**Note**: Railway will automatically provide the `DATABASE_URL` when you add the database.

### **Step 6: Update Prisma Schema for PostgreSQL**
Since Railway uses PostgreSQL, update your schema:

1. Open `wte-backend/prisma/schema.prisma`
2. Change the datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### **Step 7: Deploy and Setup Database**
1. Railway will automatically deploy your code
2. Once deployed, go to the **"Deployments"** tab
3. Click on your latest deployment
4. Open the **"Logs"** tab
5. Run these commands in the Railway console:

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed the database
npx prisma db seed
```

### **Step 8: Get Your Backend URL**
1. Go to your service dashboard
2. Click **"Settings"** → **"Domains"**
3. Copy your Railway domain (e.g., `https://smart-waste-manager-production.up.railway.app`)

### **Step 9: Update Frontend API URL**
1. Go to your GitHub repository
2. Edit `wte-frontend/src/utils/api.ts`
3. Update the `API_BASE_URL`:

```typescript
export const API_BASE_URL = 'https://your-railway-domain.up.railway.app';
```

4. Commit and push the changes
5. This will trigger a new GitHub Pages deployment

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Build Fails:**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation works locally

2. **Database Connection Issues:**
   - Verify `DATABASE_URL` is set correctly
   - Check that Prisma schema matches your database provider

3. **Environment Variables:**
   - Make sure all required variables are set
   - Check variable names match exactly

4. **CORS Issues:**
   - Update CORS settings in your backend to allow your frontend domain

### **Railway Console Commands:**
```bash
# Check if database is connected
npx prisma db pull

# Reset database (if needed)
npx prisma db push --force-reset

# View database in Prisma Studio
npx prisma studio
```

## 📊 **Monitoring Your Deployment**

1. **Logs**: Check the "Logs" tab for real-time application logs
2. **Metrics**: View CPU, memory, and network usage
3. **Health Check**: Your app has a health endpoint at `/api/health`

## 💰 **Railway Pricing**

- **Free Tier**: $5 credit monthly (usually enough for small apps)
- **Pro Plan**: $20/month for production apps
- **Database**: Included in free tier

## 🎯 **Expected Timeline**

- Account setup: 2 minutes
- Project creation: 3 minutes
- Database setup: 2 minutes
- First deployment: 5-10 minutes
- Database seeding: 2 minutes
- **Total: ~15-20 minutes**

---

**Your backend will be live at**: `https://your-app-name.up.railway.app`

**Next**: Update your frontend to use the new backend URL! 🚀
