#!/bin/bash

# CodeBattle Arena - Quick Deployment Script
# This script helps you deploy to various platforms

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║       🚀 CodeBattle Arena - Deployment Helper 🚀         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Choose your deployment platform:${NC}"
echo ""
echo "1) Vercel + Railway (Recommended for beginners)"
echo "2) AWS (Recommended for production)"
echo "3) Heroku"
echo "4) DigitalOcean"
echo "5) Render"
echo "6) Manual Docker deployment"
echo "7) Exit"
echo ""
read -p "Enter your choice (1-7): " choice

case $choice in
  1)
    echo ""
    echo -e "${GREEN}📦 Deploying to Vercel + Railway...${NC}"
    echo ""
    echo "Step 1: Install Vercel CLI"
    npm install -g vercel
    
    echo ""
    echo "Step 2: Deploy Frontend"
    cd frontend
    echo -e "${YELLOW}Follow the prompts to deploy...${NC}"
    vercel
    
    echo ""
    echo -e "${GREEN}✅ Frontend deployed!${NC}"
    echo ""
    echo "Step 3: Deploy Backend to Railway"
    echo "1. Go to https://railway.app"
    echo "2. Create new project from GitHub"
    echo "3. Add PostgreSQL and Redis databases"
    echo "4. Deploy backend service"
    echo ""
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    ;;
    
  2)
    echo ""
    echo -e "${GREEN}☁️ Deploying to AWS...${NC}"
    echo ""
    echo "Installing AWS EB CLI..."
    pip install awsebcli --upgrade
    
    echo ""
    echo "Step 1: Deploy Backend to Elastic Beanstalk"
    cd backend
    eb init
    eb create codebattle-backend-prod
    
    echo ""
    echo "Step 2: Deploy Frontend to Amplify"
    echo "1. Go to https://console.aws.amazon.com/amplify"
    echo "2. Connect your GitHub repository"
    echo "3. Select 'frontend' folder"
    echo "4. Add environment variables"
    echo "5. Deploy"
    
    echo ""
    echo -e "${GREEN}🎉 AWS Deployment initiated!${NC}"
    ;;
    
  3)
    echo ""
    echo -e "${GREEN}🟣 Deploying to Heroku...${NC}"
    echo ""
    echo "Installing Heroku CLI..."
    npm install -g heroku
    
    echo ""
    echo "Login to Heroku..."
    heroku login
    
    echo ""
    echo "Creating Heroku apps..."
    heroku create codebattle-backend
    heroku create codebattle-frontend
    
    echo ""
    echo "Adding databases..."
    heroku addons:create heroku-postgresql:mini -a codebattle-backend
    heroku addons:create heroku-redis:mini -a codebattle-backend
    
    echo ""
    echo "Deploy backend..."
    cd backend
    git init
    git add .
    git commit -m "Deploy to Heroku"
    heroku git:remote -a codebattle-backend
    git push heroku main
    
    echo ""
    echo -e "${GREEN}🎉 Heroku Deployment complete!${NC}"
    ;;
    
  4)
    echo ""
    echo -e "${GREEN}🌊 Deploying to DigitalOcean...${NC}"
    echo ""
    echo "1. Go to https://cloud.digitalocean.com/apps"
    echo "2. Click 'Create App'"
    echo "3. Connect your GitHub repository"
    echo "4. Add components (Frontend, Backend, Database)"
    echo "5. Configure and deploy"
    echo ""
    echo -e "${YELLOW}Opening DigitalOcean in browser...${NC}"
    open https://cloud.digitalocean.com/apps 2>/dev/null || xdg-open https://cloud.digitalocean.com/apps 2>/dev/null
    ;;
    
  5)
    echo ""
    echo -e "${GREEN}🎨 Deploying to Render...${NC}"
    echo ""
    echo "1. Go to https://dashboard.render.com"
    echo "2. Click 'New +' → 'Web Service'"
    echo "3. Connect your GitHub repository"
    echo "4. Add database and Redis"
    echo "5. Deploy"
    echo ""
    echo -e "${YELLOW}Opening Render in browser...${NC}"
    open https://dashboard.render.com 2>/dev/null || xdg-open https://dashboard.render.com 2>/dev/null
    ;;
    
  6)
    echo ""
    echo -e "${GREEN}🐳 Docker Deployment...${NC}"
    echo ""
    cd infrastructure/docker
    echo "Building containers..."
    docker-compose build
    echo "Starting services..."
    docker-compose up -d
    echo ""
    echo -e "${GREEN}✅ Docker containers are running!${NC}"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:5000"
    ;;
    
  7)
    echo ""
    echo "Goodbye! 👋"
    exit 0
    ;;
    
  *)
    echo ""
    echo -e "${YELLOW}Invalid choice. Please run the script again.${NC}"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   Deployment process complete! 🎉                         ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "Don't forget to:"
echo "  ✓ Update Clerk keys for production"
echo "  ✓ Set environment variables"
echo "  ✓ Run database migrations"
echo "  ✓ Test all features"
echo ""
echo "🚀 Happy deploying!"

