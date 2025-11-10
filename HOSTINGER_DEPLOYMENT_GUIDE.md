# 🚀 Hostinger Deployment Guide

## ✅ Is Hostinger Free?

**Hostinger is NOT free**, but it's very affordable:

### 💰 Hostinger Pricing

**Shared Hosting (Starting at $2.99/month):**
- ✅ Perfect for static sites
- ✅ Includes free SSL
- ✅ Free domain (1st year)
- ⚠️ Limited Node.js support
- ⚠️ Not ideal for full-stack apps

**VPS Hosting (Starting at $6.99/month):**
- ✅ Full root access
- ✅ Node.js support
- ✅ PostgreSQL/MySQL support
- ✅ Perfect for your backend
- ✅ Scalable resources

**Cloud Hosting (Starting at $9.99/month):**
- ✅ Better performance
- ✅ More resources
- ✅ Auto-scaling

---

## 🎯 Best Setup for Your CodeBattle Arena

### **Option 1: Hostinger VPS (Recommended)**

```
Frontend → Vercel (FREE) ✅
Backend → Hostinger VPS ($6.99/month) 💰
Database → Hostinger MySQL/PostgreSQL (Included) ✅
Redis → Install on VPS (FREE) ✅

Total: ~$6.99/month
```

### **Option 2: Full Hostinger Setup**

```
Frontend → Hostinger VPS ($6.99/month) 💰
Backend → Hostinger VPS ($6.99/month) 💰
Database → Hostinger MySQL (Included) ✅

Total: ~$6.99/month (single VPS)
```

### **Option 3: Hybrid (Best Value)**

```
Frontend → Vercel (FREE FOREVER) ✅
Backend → Hostinger VPS ($6.99/month) 💰
Database → Hostinger MySQL (Included) ✅

Total: ~$6.99/month (CHEAPEST!)
```

---

## 📋 Step-by-Step Hostinger Deployment

### **Step 1: Sign Up for Hostinger**

1. Go to [hostinger.com](https://www.hostinger.com)
2. Click "Get Started"
3. Choose **VPS Hosting** plan
4. Select **VPS 1** ($6.99/month) - Perfect for your app
5. Complete checkout

### **Step 2: Setup VPS**

1. **Login to hPanel** (Hostinger's control panel)
2. **Go to VPS Management**
3. **Access your VPS** via SSH or Browser Terminal

**Initial VPS Setup:**

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Verify installation
node --version  # Should show v18.x.x
npm --version

# 4. Install PM2 (Process Manager)
sudo npm install -g pm2

# 5. Install Git
sudo apt install git -y

# 6. Install Nginx (Reverse Proxy)
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# 7. Install PostgreSQL (if needed)
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 8. Install Redis
sudo apt install redis-server -y
sudo systemctl start redis
sudo systemctl enable redis
```

### **Step 3: Deploy Backend**

```bash
# 1. Clone your repository
cd /var/www
sudo git clone https://github.com/yourusername/codebattle-platform.git
cd codebattle-platform/backend

# 2. Install dependencies
npm install

# 3. Setup environment variables
sudo nano .env
```

**Add to `.env`:**
```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codebattle
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Clerk (if using)
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key

# OpenAI (if using)
OPENAI_API_KEY=your_openai_key
```

```bash
# 4. Build backend (if TypeScript)
npm run build

# 5. Start with PM2
pm2 start dist/server.js --name codebattle-backend
# OR if using TypeScript with ts-node:
pm2 start src/server.ts --name codebattle-backend --interpreter ts-node

# 6. Save PM2 configuration
pm2 save

# 7. Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs (usually sudo env PATH=...)

# 8. Check status
pm2 status
pm2 logs codebattle-backend
```

### **Step 4: Setup Nginx Reverse Proxy**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/codebattle
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support (for Socket.IO)
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Root location
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/codebattle /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### **Step 5: Setup Database**

```bash
# 1. Access PostgreSQL
sudo -u postgres psql

# 2. Create database and user
CREATE DATABASE codebattle;
CREATE USER codebattle_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE codebattle TO codebattle_user;
\q

# 3. Import schema
psql -U codebattle_user -d codebattle -f /var/www/codebattle-platform/infrastructure/database/schema.sql
psql -U codebattle_user -d codebattle -f /var/www/codebattle-platform/infrastructure/database/room-schema.sql
```

### **Step 6: Setup SSL Certificate (FREE)**

Hostinger provides **FREE SSL** via Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

### **Step 7: Deploy Frontend**

**Option A: Deploy to Vercel (Recommended - FREE)**

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repo
3. Select `frontend` folder
4. Add environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_key
   NEXT_PUBLIC_API_URL=https://your-domain.com/api
   ```
5. Deploy!

**Option B: Deploy to Hostinger VPS**

```bash
# 1. Build frontend
cd /var/www/codebattle-platform/frontend
npm install
npm run build

# 2. Install PM2 for frontend
pm2 start npm --name "codebattle-frontend" -- start

# 3. Update Nginx config
sudo nano /etc/nginx/sites-available/codebattle
```

**Updated Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Security Setup

### **1. Firewall Configuration**

```bash
# Install UFW (Uncomplicated Firewall)
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### **2. Secure SSH**

```bash
# Disable password login (use keys only)
sudo nano /etc/ssh/sshd_config

# Change:
# PasswordAuthentication no
# PermitRootLogin no

# Restart SSH
sudo systemctl restart sshd
```

### **3. Environment Variables Security**

```bash
# Store sensitive data securely
sudo nano /etc/environment

# Add your secrets (but be careful!)
# Better: Use PM2 ecosystem file
```

**PM2 Ecosystem File (`ecosystem.config.js`):**
```javascript
module.exports = {
  apps: [{
    name: 'codebattle-backend',
    script: './dist/server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DB_HOST: 'localhost',
      DB_PASSWORD: 'your_password'
    }
  }]
}
```

---

## 📊 Hostinger vs Other Platforms

| Platform | Price/Month | Node.js | Database | Best For |
|----------|-------------|---------|----------|----------|
| **Hostinger VPS** | $6.99 | ✅ Yes | ✅ MySQL/PostgreSQL | Full control |
| **AWS EC2** | $0-15 | ✅ Yes | ✅ RDS (extra cost) | Enterprise |
| **Railway** | $5-20 | ✅ Yes | ✅ Included | Easy deployment |
| **Render** | $7-25 | ✅ Yes | ✅ Included | Simple setup |
| **Heroku** | $7-25 | ✅ Yes | ✅ Add-ons | Traditional PaaS |
| **Vercel** | $0-20 | ✅ Yes | ❌ External | Frontend only |

---

## 💡 Cost Optimization Tips

### **Save Money:**

1. ✅ **Use Vercel for frontend** (FREE)
2. ✅ **Use Hostinger VPS for backend** ($6.99/month)
3. ✅ **Use included MySQL** (instead of PostgreSQL)
4. ✅ **Optimize resources** (start with smallest VPS)
5. ✅ **Use free SSL** (Let's Encrypt)

### **Total Monthly Cost:**

```
Hostinger VPS:     $6.99/month
Vercel Frontend:   $0/month (FREE)
SSL Certificate:   $0/month (FREE)
Domain:            $0/month (FREE first year)

Total: ~$6.99/month 🎉
```

---

## 🚀 Quick Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying CodeBattle Arena to Hostinger..."

# Pull latest code
cd /var/www/codebattle-platform
git pull origin main

# Backend
cd backend
npm install
npm run build
pm2 restart codebattle-backend

# Frontend (if deploying to VPS)
cd ../frontend
npm install
npm run build
pm2 restart codebattle-frontend

echo "✅ Deployment complete!"
pm2 status
```

Make it executable:
```bash
chmod +x deploy.sh
```

---

## 📋 Post-Deployment Checklist

- [ ] Backend is running (`pm2 status`)
- [ ] Frontend is accessible (if on VPS)
- [ ] Database is connected
- [ ] Redis is running
- [ ] SSL certificate is active
- [ ] Nginx is serving correctly
- [ ] Environment variables are set
- [ ] Firewall is configured
- [ ] PM2 auto-start is enabled
- [ ] Domain is pointing to server

---

## 🔧 Troubleshooting

### **Backend Not Starting:**

```bash
# Check logs
pm2 logs codebattle-backend

# Check if port is in use
sudo netstat -tulpn | grep 5000

# Restart
pm2 restart codebattle-backend
```

### **Database Connection Issues:**

```bash
# Test PostgreSQL connection
psql -U codebattle_user -d codebattle -h localhost

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

### **Nginx Not Working:**

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🎯 My Recommendation

**For CodeBattle Arena:**

1. **Frontend** → **Vercel** (FREE forever)
2. **Backend** → **Hostinger VPS** ($6.99/month)
3. **Database** → **Hostinger MySQL** (Included)
4. **Redis** → **Install on VPS** (FREE)

**Total: $6.99/month** - Best value! 🎉

---

## 📚 Useful Hostinger Resources

- [Hostinger Knowledge Base](https://www.hostinger.com/tutorials)
- [VPS Management Guide](https://www.hostinger.com/tutorials/how-to-use-vps)
- [SSH Access Guide](https://www.hostinger.com/tutorials/how-to-use-ssh)
- [hPanel Documentation](https://www.hostinger.com/tutorials/hpanel)

---

## ✅ Summary

**Hostinger is NOT free**, but at **$6.99/month** it's:
- ✅ Cheaper than AWS after free tier
- ✅ Full root access
- ✅ Node.js support
- ✅ Database included
- ✅ FREE SSL
- ✅ FREE domain (first year)
- ✅ Great for beginners

**Best Setup:**
- Frontend: Vercel (FREE)
- Backend: Hostinger VPS ($6.99/month)
- **Total: $6.99/month** - Perfect! 🚀

---

**Ready to deploy?** Follow the steps above and your CodeBattle Arena will be live! 🎉


