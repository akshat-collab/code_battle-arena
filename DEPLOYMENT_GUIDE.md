# 🚀 CodeBattle Arena - Deployment Guide

Complete guide to deploy your CodeBattle Arena to production.

---

## 📋 Table of Contents

1. [Quick Deployment (Easiest)](#quick-deployment-easiest)
2. [AWS Deployment (Recommended)](#aws-deployment-recommended)
3. [Alternative Platforms](#alternative-platforms)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🎯 Quick Deployment (Easiest)

### **Option 1: Vercel + Railway (Recommended for Beginners)**

**Cost:** Free tier available, ~$5-20/month for production

#### **Step 1: Deploy Frontend to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: codebattle-arena
# - Directory: ./
# - Override settings: No
```

**OR use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Select `frontend` folder as root directory
5. Add environment variables (see below)
6. Click "Deploy"

#### **Step 2: Deploy Backend & Database to Railway**

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Add services:
   - **PostgreSQL** (click "Add Database")
   - **Redis** (click "Add Database")
   - **Backend** (from your repo, select `backend` folder)

6. Configure Backend:
```bash
# In Railway, set these environment variables:
PORT=5000
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
```

7. Click "Deploy"

#### **Step 3: Connect Frontend to Backend**

In Vercel, add this environment variable:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

✅ **Done! Your app is live!**

---

## ☁️ AWS Deployment (Recommended)

### **Architecture Overview**

```
Frontend → AWS Amplify (or S3 + CloudFront)
Backend → AWS Elastic Beanstalk (or ECS)
Database → AWS RDS (PostgreSQL)
Cache → AWS ElastiCache (Redis)
Storage → AWS S3
```

### **Cost Estimate:** ~$30-100/month

---

### **1. Deploy Database (RDS)**

#### **1.1 Create PostgreSQL Database**

```bash
# Using AWS CLI
aws rds create-db-instance \
    --db-instance-identifier codebattle-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password YourStrongPassword123! \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-your-security-group \
    --backup-retention-period 7 \
    --publicly-accessible
```

**OR use AWS Console:**
1. Go to RDS Console
2. Click "Create database"
3. Choose PostgreSQL
4. Template: Free tier (or Production)
5. DB instance identifier: `codebattle-db`
6. Master username: `admin`
7. Master password: Set a strong password
8. Storage: 20 GB
9. Enable automatic backups
10. Create database

#### **1.2 Create Redis Cache**

```bash
# Using AWS CLI
aws elasticache create-cache-cluster \
    --cache-cluster-id codebattle-cache \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1
```

---

### **2. Deploy Backend (Elastic Beanstalk)**

#### **2.1 Install EB CLI**

```bash
pip install awsebcli --upgrade --user
```

#### **2.2 Initialize and Deploy**

```bash
# Navigate to backend
cd backend

# Initialize Elastic Beanstalk
eb init

# Choose:
# - Region: us-east-1 (or your preferred region)
# - Application name: codebattle-backend
# - Platform: Node.js
# - SSH: Yes (recommended)

# Create environment and deploy
eb create codebattle-backend-prod

# Set environment variables
eb setenv \
  PORT=5000 \
  NODE_ENV=production \
  DATABASE_URL="postgresql://admin:password@your-rds-endpoint:5432/codebattle" \
  REDIS_URL="redis://your-elasticache-endpoint:6379" \
  CLERK_SECRET_KEY="your_clerk_secret_key" \
  OPENAI_API_KEY="your_openai_api_key"

# Deploy updates
eb deploy
```

---

### **3. Deploy Frontend (AWS Amplify)**

#### **Option A: Using Amplify Console (Easiest)**

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Select branch: `main`
5. Build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/.next
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```
6. Add environment variables:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_API_URL=https://your-backend.elasticbeanstalk.com
```
7. Click "Save and deploy"

#### **Option B: Using S3 + CloudFront**

```bash
# Build frontend
cd frontend
npm run build
npm run export  # If using static export

# Create S3 bucket
aws s3 mb s3://codebattle-arena --region us-east-1

# Enable static website hosting
aws s3 website s3://codebattle-arena \
  --index-document index.html \
  --error-document 404.html

# Upload files
aws s3 sync out/ s3://codebattle-arena --acl public-read

# Create CloudFront distribution (optional, for CDN)
aws cloudfront create-distribution \
  --origin-domain-name codebattle-arena.s3.amazonaws.com
```

---

## 🌐 Alternative Platforms

### **Option 2: Vercel + Supabase**

**Best for:** Quick deployment with managed database

1. **Deploy Frontend to Vercel** (see above)
2. **Setup Supabase:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string
   - Run your SQL schema
3. **Deploy Backend to Vercel Serverless:**
   ```bash
   cd backend
   vercel
   ```

**Cost:** Free tier, ~$10-25/month for production

---

### **Option 3: Heroku (Simple)**

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create apps
heroku create codebattle-backend
heroku create codebattle-frontend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini -a codebattle-backend

# Add Redis
heroku addons:create heroku-redis:mini -a codebattle-backend

# Deploy backend
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a codebattle-backend
git push heroku main

# Deploy frontend
cd ../frontend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a codebattle-frontend
git push heroku main
```

**Cost:** ~$7/month per dyno + addons

---

### **Option 4: DigitalOcean App Platform**

1. Go to [digitalocean.com/products/app-platform](https://digitalocean.com/products/app-platform)
2. Create new app from GitHub
3. Add components:
   - **Frontend:** Static site or Node.js
   - **Backend:** Node.js service
   - **Database:** PostgreSQL cluster
   - **Cache:** Redis cluster
4. Configure build commands
5. Deploy

**Cost:** ~$12-30/month

---

### **Option 5: Render (Modern Alternative)**

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Add services:
   - PostgreSQL database
   - Redis instance
   - Backend web service
   - Frontend static site
5. Deploy

**Cost:** Free tier, ~$7-20/month for production

---

## 🔐 Environment Variables Setup

### **Frontend (.env.production)**

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY
CLERK_SECRET_KEY=sk_live_YOUR_KEY

# API
NEXT_PUBLIC_API_URL=https://api.yourapp.com

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/community
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/community
```

### **Backend (.env.production)**

```bash
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379

# Authentication
CLERK_SECRET_KEY=sk_live_YOUR_KEY

# AI
OPENAI_API_KEY=sk-YOUR_KEY

# CORS
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
```

---

## 📝 Pre-Deployment Checklist

### **1. Security**

```bash
# Update Clerk keys to production keys
✓ Get production keys from dashboard.clerk.com
✓ Add to production environment variables
✓ Update CORS origins in backend
```

### **2. Database**

```bash
# Run migrations
cd backend
npm run migrate

# Seed initial data (optional)
npm run seed
```

### **3. Frontend Build Test**

```bash
cd frontend
npm run build
npm run start  # Test production build locally
```

### **4. Backend Test**

```bash
cd backend
npm run build
npm run start  # Test production build locally
```

### **5. Domain Setup (Optional)**

```bash
# Buy domain from:
- Namecheap
- GoDaddy
- Google Domains

# Point to your deployment:
- Vercel: Add domain in dashboard
- AWS: Use Route 53
- Other: Use DNS settings
```

---

## 🚀 Deployment Commands Cheat Sheet

### **Vercel**
```bash
cd frontend
vercel --prod
```

### **AWS Elastic Beanstalk**
```bash
cd backend
eb deploy
```

### **Railway**
```bash
railway up
```

### **Heroku**
```bash
git push heroku main
```

### **Docker (Manual)**
```bash
docker-compose up -d
```

---

## 📊 Cost Comparison

| Platform | Frontend | Backend | Database | Total/Month |
|----------|----------|---------|----------|-------------|
| **Vercel + Railway** | Free-$20 | $5 | $5 | $10-30 |
| **AWS** | $5-15 | $20-30 | $15-25 | $40-70 |
| **Heroku** | $7 | $7 | $9 | $23+ |
| **DigitalOcean** | $5 | $12 | $15 | $32 |
| **Render** | $0-7 | $7 | $7 | $14-21 |

---

## 🎯 Recommended Deployment Path

### **For Beginners:**
**Vercel (Frontend) + Railway (Backend + DB)**
- Easiest setup
- Free tier available
- Automatic deployments
- Great developer experience

### **For Production:**
**AWS Amplify (Frontend) + Elastic Beanstalk (Backend) + RDS (Database)**
- Most scalable
- Enterprise-grade
- Better performance
- More control

### **For Budget:**
**Render (All-in-one)**
- Good free tier
- Simple pricing
- Easy setup
- One platform for everything

---

## 🔧 Troubleshooting

### **Issue: CORS errors**
```javascript
// backend/src/server.ts
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}))
```

### **Issue: Database connection fails**
```bash
# Check security groups (AWS)
# Allow inbound traffic on port 5432 (PostgreSQL) and 6379 (Redis)

# Test connection
psql -h your-endpoint -U admin -d codebattle
```

### **Issue: Build fails**
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [AWS Amplify Guide](https://docs.amplify.aws)
- [Elastic Beanstalk Guide](https://docs.aws.amazon.com/elasticbeanstalk)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/overview)

---

## ✅ Post-Deployment

1. **Test all features:**
   - Sign in/Sign up
   - Create rooms
   - Join rooms
   - Friend invitations
   - Community posts

2. **Monitor:**
   - Check error logs
   - Monitor performance
   - Track API usage

3. **Set up:**
   - Custom domain
   - SSL certificate (usually automatic)
   - Analytics (Google Analytics, Vercel Analytics)
   - Error tracking (Sentry)

---

**Need help?** Join the discussion or open an issue!

🚀 **Your CodeBattle Arena is ready for the world!**

