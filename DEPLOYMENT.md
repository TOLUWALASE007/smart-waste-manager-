# 🚀 Deployment Guide - Smart Waste Manager

This guide covers different deployment options for the Smart Waste Manager application.

## 📋 Deployment Options

### Option 1: GitHub Pages (Frontend Only) + Backend Hosting

**Best for**: Quick demo and showcasing the frontend

#### Frontend Deployment to GitHub Pages

1. **Enable GitHub Pages in your repository:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Source: "GitHub Actions"

2. **The deployment is automated:**
   - Push to `main` branch triggers automatic deployment
   - Frontend will be available at: `https://toluwalase007.github.io/smart-waste-manager-/`

3. **Backend Hosting Options:**
   - **Railway**: https://railway.app (Recommended - Free tier available)
   - **Render**: https://render.com (Free tier available)
   - **Heroku**: https://heroku.com (Paid)
   - **Vercel**: https://vercel.com (Free tier available)

#### Backend Deployment to Railway

1. **Prepare backend for production:**
   ```bash
   cd wte-backend
   npm install
   ```

2. **Create railway.json:**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm run dev",
       "healthcheckPath": "/api/health"
     }
   }
   ```

3. **Deploy to Railway:**
   - Connect your GitHub repository
   - Select the `wte-backend` folder
   - Add environment variables:
     - `JWT_SECRET`: Your secret key
     - `PORT`: 4000

4. **Update frontend API URL:**
   - Change `API_BASE_URL` in `wte-frontend/src/utils/api.ts`
   - Use your Railway backend URL

### Option 2: Full-Stack Deployment

**Best for**: Production application

#### Vercel (Frontend + Backend)

1. **Deploy Frontend:**
   - Connect repository to Vercel
   - Root directory: `wte-frontend`
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Deploy Backend:**
   - Create separate Vercel project
   - Root directory: `wte-backend`
   - Build command: `npm run build`
   - Output directory: `dist`

#### Netlify (Frontend) + Railway (Backend)

1. **Frontend on Netlify:**
   - Connect repository
   - Base directory: `wte-frontend`
   - Build command: `npm run build`
   - Publish directory: `wte-frontend/dist`

2. **Backend on Railway:**
   - Follow Railway deployment steps above

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
JWT_SECRET=your-super-secret-key
PORT=4000
```

## 📱 Mobile Considerations

- The app is responsive and works on mobile devices
- Consider PWA features for better mobile experience
- Test on different screen sizes

## 🔒 Security Considerations

- Use HTTPS in production
- Set strong JWT secrets
- Implement rate limiting
- Add CORS configuration for production domains
- Use environment variables for sensitive data

## 📊 Monitoring

- Add error tracking (Sentry, LogRocket)
- Monitor API performance
- Set up uptime monitoring
- Database backup strategy

## 🚀 Quick Start Commands

```bash
# Install dependencies
cd wte-frontend && npm install
cd ../wte-backend && npm install

# Build for production
cd wte-frontend && npm run build
cd ../wte-backend && npm run build

# Deploy to GitHub Pages (frontend only)
cd wte-frontend && npm run deploy
```

## 🌐 Live Demo URLs

- **Frontend**: https://toluwalase007.github.io/smart-waste-manager-/
- **Backend**: [Your deployed backend URL]

## 📞 Support

If you encounter issues during deployment:
1. Check the GitHub Actions logs
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check CORS configuration

---

**Happy Deploying!** 🎉
