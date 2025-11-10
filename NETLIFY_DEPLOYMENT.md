# 🚀 Netlify Deployment Guide for CodeBattle Arena

This guide will help you deploy your CodeBattle Arena frontend to Netlify.

## ⚠️ Important Notes

**Netlify can host:**
- ✅ Next.js frontend (with some limitations)
- ✅ Static assets and pages
- ✅ Serverless functions (limited)

**Netlify CANNOT host:**
- ❌ Full Express.js backend (needs separate hosting)
- ❌ PostgreSQL database (needs external service)
- ❌ Redis (needs external service)
- ❌ Socket.IO real-time connections (needs persistent server)

## 📋 Deployment Strategy

**Recommended Setup:**
- **Frontend:** Netlify (this guide)
- **Backend:** Railway, Render, or Heroku (separate deployment)
- **Database:** Railway PostgreSQL, Supabase, or Neon
- **Redis:** Upstash (free tier available)

---

## 🎯 Step 1: Prepare Your Frontend

### 1.1 Update Environment Variables

Create `frontend/.env.production`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
CLERK_SECRET_KEY=sk_live_your_key_here

# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/community
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/community
```

### 1.2 Update API URLs

Make sure your frontend code uses environment variables for API calls. The code should already be using `NEXT_PUBLIC_API_URL`.

---

## 🚀 Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Easiest)

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub (recommended)

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Build Settings**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/.next` (or leave empty, Netlify will detect it)

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.production`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
     CLERK_SECRET_KEY
     NEXT_PUBLIC_API_URL
     NEXT_PUBLIC_WS_URL
     NEXT_PUBLIC_CLERK_SIGN_IN_URL
     NEXT_PUBLIC_CLERK_SIGN_UP_URL
     NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
     NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site.netlify.app`

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend directory
cd frontend

# Login to Netlify
netlify login

# Initialize Netlify (first time only)
netlify init

# Follow prompts:
# - Create & configure a new site: Yes
# - Team: Select your team
# - Site name: codebattle-arena (or your choice)
# - Build command: npm run build
# - Directory to deploy: .next

# Set environment variables
netlify env:set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY "pk_live_your_key"
netlify env:set CLERK_SECRET_KEY "sk_live_your_key"
netlify env:set NEXT_PUBLIC_API_URL "https://your-backend.railway.app"
netlify env:set NEXT_PUBLIC_WS_URL "wss://your-backend.railway.app"

# Deploy
netlify deploy --prod
```

---

## 🔧 Step 3: Deploy Backend Separately

Since Netlify can't host your Express backend, deploy it separately:

### Option 1: Railway (Recommended - Easy & Free Tier)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add services:
   - **PostgreSQL** (click "Add Database")
   - **Redis** (click "Add Database") 
   - **Backend** (from GitHub repo, select `backend` folder)
4. Set environment variables in Railway:
   ```env
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   CLERK_SECRET_KEY=your_clerk_secret_key
   OPENAI_API_KEY=your_openai_api_key
   FRONTEND_URL=https://your-site.netlify.app
   ```
5. Get your Railway backend URL (e.g., `https://your-backend.railway.app`)
6. Update Netlify environment variable `NEXT_PUBLIC_API_URL` with Railway URL

### Option 2: Render (Free Tier Available)

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Select `backend` folder
5. Set build command: `npm install && npm run build`
6. Set start command: `npm start`
7. Add environment variables (same as Railway)
8. Get Render URL and update Netlify

### Option 3: Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
cd backend
heroku create codebattle-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set CLERK_SECRET_KEY=your_key
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

---

## 🗄️ Step 4: Setup Database

### Option 1: Railway PostgreSQL (Easiest)
- Already included when you add PostgreSQL service in Railway
- Connection string automatically available as `DATABASE_URL`

### Option 2: Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Run your schema: Go to SQL Editor → Paste `infrastructure/database/schema.sql` → Run

### Option 3: Neon (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Run schema via psql or their web interface

---

## 🔄 Step 5: Update CORS Settings

In your backend (Railway/Render/Heroku), make sure CORS allows your Netlify domain:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: [
    'https://your-site.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}))
```

---

## ✅ Step 6: Verify Deployment

1. **Frontend:** Visit `https://your-site.netlify.app`
2. **Backend:** Test `https://your-backend.railway.app/health`
3. **Test Features:**
   - Sign in/Sign up
   - Create a room
   - Join a room
   - Check API calls in browser DevTools

---

## 🌐 Step 7: Custom Domain (Optional)

1. In Netlify dashboard → Domain settings
2. Click "Add custom domain"
3. Enter your domain (e.g., `codebattle.com`)
4. Follow DNS configuration instructions
5. Netlify will automatically provision SSL certificate

---

## 📊 Monitoring & Logs

### View Logs:
- **Netlify:** Site dashboard → Deploys → Click deploy → View logs
- **Railway:** Service → Logs tab
- **Render:** Service → Logs tab

### Monitor Performance:
- Netlify Analytics (paid feature)
- Or use Vercel Analytics (free alternative)

---

## 🐛 Troubleshooting

### Build Fails on Netlify

**Error: "Module not found"**
- Check `package.json` dependencies
- Ensure all imports are correct
- Check Node version (should be 18+)

**Error: "Build timeout"**
- Netlify free tier has 15-minute build limit
- Optimize build: Remove unused dependencies
- Consider upgrading to Pro plan

### API Calls Fail

**CORS Errors:**
- Update backend CORS to include Netlify domain
- Check `NEXT_PUBLIC_API_URL` is set correctly

**404 Errors:**
- Verify backend is deployed and running
- Check backend URL is correct
- Test backend health endpoint

### Socket.IO Not Working

**Note:** Socket.IO requires persistent connections, which Netlify serverless functions don't support well.

**Solutions:**
1. Use Railway/Render for backend (supports WebSockets)
2. Or use alternative real-time solution (Server-Sent Events, polling)
3. Or deploy full-stack on Vercel (better Next.js support)

---

## 💰 Cost Estimate

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Netlify** | 100GB bandwidth/month | $19/month (Pro) |
| **Railway** | $5 credit/month | $5-20/month |
| **Supabase** | 500MB database | $25/month |
| **Upstash Redis** | 10K commands/day | $0.20/100K commands |

**Total Free Tier:** ~$0-5/month
**Total Paid:** ~$25-50/month

---

## 🎯 Next Steps

1. ✅ Deploy frontend to Netlify
2. ✅ Deploy backend to Railway/Render
3. ✅ Setup database
4. ✅ Configure environment variables
5. ✅ Test all features
6. ✅ Add custom domain
7. ✅ Setup monitoring

---

## 📚 Additional Resources

- [Netlify Next.js Docs](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Clerk Deployment Guide](https://clerk.com/docs/deployments/overview)

---

**Need Help?** Check the main [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for more deployment options.

