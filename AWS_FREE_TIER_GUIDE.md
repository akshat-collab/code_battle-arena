# 🚀 AWS Deployment Guide - Free Tier Information

## ✅ Is AWS Free?

**Yes, AWS has a FREE TIER** but with important limitations:

### 🆓 AWS Free Tier (12 Months)

**What's FREE for 12 months:**
- ✅ **EC2 t2.micro/t3.micro**: 750 hours/month (1 instance)
- ✅ **RDS db.t2.micro**: 750 hours/month (MySQL/PostgreSQL)
- ✅ **S3 Storage**: 5 GB
- ✅ **Lambda**: 1 million requests/month
- ✅ **CloudFront**: 50 GB data transfer out
- ✅ **Elastic Beanstalk**: FREE (you pay for underlying resources)
- ✅ **Amplify**: FREE hosting for static sites

**After 12 months:**
- Most services become **PAID**
- But some services remain **ALWAYS FREE** (see below)

### 🆓 Always Free Services (No Time Limit)

- ✅ **Lambda**: 1M requests/month forever
- ✅ **S3**: 5 GB storage forever
- ✅ **CloudWatch**: 10 custom metrics forever
- ✅ **CodeCommit**: 5 users/month forever

---

## 💰 Cost Breakdown for Your App

### **Option 1: Minimal Setup (FREE for 12 months)**

```
Frontend (Vercel/Netlify):     $0/month  ✅ FREE
Backend (EC2 t2.micro):        $0/month  ✅ FREE (750 hrs)
PostgreSQL (RDS t2.micro):     $0/month  ✅ FREE (750 hrs)
Redis (ElastiCache):           $0/month  ✅ FREE tier
S3 Storage:                    $0/month  ✅ FREE (5 GB)
Lambda (AI functions):         $0/month  ✅ FREE (1M requests)

Total: $0/month for 12 months! 🎉
```

### **Option 2: Production Setup (After Free Tier)**

```
Frontend (Amplify):           ~$1/month  (minimal traffic)
Backend (EC2 t3.small):       ~$15/month
PostgreSQL (RDS t3.micro):    ~$13/month
Redis (ElastiCache):          ~$13/month
S3 Storage:                   ~$1/month  (for backups)
Lambda:                        ~$0/month (within free tier)

Total: ~$43/month 💰
```

---

## 🚀 Recommended AWS Deployment Strategy

### **For FREE Deployment (Best Option)**

**Use AWS Free Tier + Vercel/Railway:**

1. **Frontend** → **Vercel** (FREE forever)
   - Unlimited deployments
   - Automatic SSL
   - Global CDN
   - Zero config

2. **Backend** → **AWS EC2 t2.micro** (FREE for 12 months)
   - Install Node.js
   - Run your Express server
   - Auto-restart with PM2

3. **Database** → **Railway PostgreSQL** (FREE tier available)
   - Or AWS RDS db.t2.micro (FREE for 12 months)

4. **Redis** → **Railway Redis** (FREE tier)
   - Or AWS ElastiCache (FREE tier)

**Total Cost: $0/month** ✅

---

## 📋 Step-by-Step AWS Deployment

### **Step 1: Create AWS Account**

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Enter your details
4. Add credit card (won't be charged if you stay in free tier)
5. Verify phone number

### **Step 2: Deploy Frontend (Amplify)**

```bash
# Install AWS CLI
pip install awscli

# Configure AWS CLI
aws configure
# Enter your Access Key ID and Secret Access Key

# Option A: Deploy via Amplify Console (Easiest)
# 1. Go to AWS Amplify Console
# 2. Click "New App" → "Host web app"
# 3. Connect your GitHub repo
# 4. Select "frontend" folder
# 5. Add environment variables:
#    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
#    - CLERK_SECRET_KEY
# 6. Deploy!

# Option B: Deploy via CLI
cd frontend
npm run build
# Upload build folder to S3
# Configure CloudFront distribution
```

### **Step 3: Deploy Backend (EC2)**

```bash
# 1. Launch EC2 Instance
# - Go to EC2 Console
# - Click "Launch Instance"
# - Choose: Amazon Linux 2 (Free Tier Eligible)
# - Instance Type: t2.micro (FREE)
# - Create/Select Key Pair
# - Configure Security Group:
#   - SSH (22) from your IP
#   - HTTP (80) from anywhere
#   - HTTPS (443) from anywhere
#   - Custom TCP (5000) from anywhere (your API)

# 2. Connect to Instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 3. Install Node.js
sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 4. Install Git
sudo yum install git -y

# 5. Clone and Setup Backend
git clone your-repo-url
cd codebattle-platform/backend
npm install

# 6. Setup Environment Variables
nano .env
# Add your environment variables

# 7. Install PM2 (Process Manager)
npm install -g pm2

# 8. Start Backend
pm2 start src/server.ts --name codebattle-backend
pm2 save
pm2 startup

# 9. Setup Nginx (Reverse Proxy)
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure Nginx
sudo nano /etc/nginx/conf.d/default.conf
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

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
sudo systemctl restart nginx
```

### **Step 4: Setup Database (RDS)**

```bash
# 1. Go to RDS Console
# 2. Click "Create Database"
# 3. Choose:
#    - Engine: PostgreSQL
#    - Version: Latest
#    - Template: Free Tier
#    - DB Instance: db.t2.micro (FREE)
#    - Storage: 20 GB (FREE)
#    - Master username/password
# 4. Configure Security Group:
#    - Allow PostgreSQL (5432) from your EC2 security group
# 5. Create Database

# 6. Update Backend .env
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=codebattle
DB_USER=your-username
DB_PASSWORD=your-password
```

### **Step 5: Setup Redis**

```bash
# Option A: AWS ElastiCache (FREE tier)
# 1. Go to ElastiCache Console
# 2. Create Redis Cluster
# 3. Choose: cache.t2.micro (FREE)
# 4. Configure Security Group

# Option B: Install Redis on EC2 (FREE)
sudo yum install redis -y
sudo systemctl start redis
sudo systemctl enable redis
```

---

## 🔒 Security Best Practices

### **1. Security Groups**
- Only allow necessary ports
- Restrict SSH to your IP only
- Use HTTPS everywhere

### **2. Environment Variables**
- Never commit `.env` files
- Use AWS Secrets Manager for production
- Rotate keys regularly

### **3. SSL Certificates**
- Use AWS Certificate Manager (FREE)
- Setup CloudFront with SSL
- Enable HTTPS redirect

---

## 💡 Cost Optimization Tips

### **Stay in Free Tier:**
1. ✅ Use t2.micro/t3.micro instances
2. ✅ Use db.t2.micro databases
3. ✅ Monitor usage in AWS Billing Dashboard
4. ✅ Set up billing alerts
5. ✅ Stop instances when not in use

### **Cost Monitoring:**
```bash
# Setup Billing Alerts
# 1. Go to Billing Dashboard
# 2. Click "Budgets"
# 3. Create budget:
#    - Amount: $5 (alert threshold)
#    - Alert when: 80% of budget
```

---

## 🎯 Quick Deploy Commands

### **Complete AWS Setup Script:**

```bash
#!/bin/bash

# 1. Install AWS CLI
pip install awscli

# 2. Configure AWS
aws configure

# 3. Create EC2 Instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name your-key-name \
  --security-group-ids sg-xxxxxxxxx

# 4. Deploy Frontend (Amplify)
# Use AWS Console → Amplify → Connect GitHub

# 5. Deploy Backend
# SSH into EC2 and follow Step 3 above
```

---

## 📊 Cost Comparison: AWS vs Alternatives

| Platform | Free Tier | Monthly Cost | Best For |
|----------|-----------|--------------|----------|
| **AWS** | 12 months | $0-43 | Enterprise, Scalability |
| **Vercel** | Forever | $0-20 | Frontend (Best!) |
| **Railway** | $5 credit | $5-20 | Simple Deployment |
| **Render** | Forever | $0-14 | Full Stack |
| **Heroku** | No | $25+ | Traditional PaaS |

---

## ✅ Recommended: Hybrid Approach

**Best FREE Setup:**

```
Frontend → Vercel (FREE forever) ✅
Backend → Railway (FREE tier) ✅
Database → Railway PostgreSQL (FREE tier) ✅
Redis → Railway Redis (FREE tier) ✅
```

**Total: $0/month FOREVER!** 🎉

---

## 🚨 Important Notes

1. **Credit Card Required**: AWS requires a credit card even for free tier
2. **Auto-Charges**: If you exceed free tier, you'll be charged automatically
3. **Set Budget Alerts**: Always setup billing alerts at $5 threshold
4. **Stop Instances**: Stop EC2/RDS when not in use to save hours
5. **12 Month Limit**: Free tier expires after 12 months

---

## 📚 AWS Documentation

- [AWS Free Tier](https://aws.amazon.com/free/)
- [EC2 Free Tier](https://aws.amazon.com/free/compute/)
- [RDS Free Tier](https://aws.amazon.com/rds/free/)
- [Amplify Hosting](https://aws.amazon.com/amplify/)

---

## 🎯 My Recommendation

**For your CodeBattle Arena:**

1. **Start with FREE tier** (Vercel + Railway) → $0/month
2. **If you need AWS**, use EC2 + RDS free tier → $0/month for 12 months
3. **After 12 months**, migrate to Railway or stay on AWS (~$43/month)

**Bottom Line**: AWS is FREE for 12 months, then becomes paid. For permanent free hosting, use Vercel + Railway combination!

---

**Need help deploying?** Check `DEPLOYMENT_GUIDE.md` for detailed steps! 🚀

