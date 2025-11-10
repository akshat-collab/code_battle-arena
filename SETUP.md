# CodeBattle Arena Setup Instructions

## Quick Setup

### Using Docker (Recommended)

```bash
# 1. Start all services
cd infrastructure/docker
docker-compose up -d

# 2. Wait for services to be healthy
docker-compose ps

# 3. Initialize database
docker exec -i codebattle-postgres psql -U postgres -d codebattle < ../database/schema.sql

# 4. Install frontend dependencies
cd ../../frontend
npm install

# 5. Install backend dependencies
cd ../backend
npm install

# 6. Start frontend
cd ../frontend
npm run dev

# 7. In another terminal, start backend
cd backend
npm run dev

# 8. In another terminal, start code execution
cd backend/services/code-execution-app
pip install -r requirements.txt
python main.py
```

## Manual Setup

### Database Setup

```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt-get install postgresql  # Ubuntu

# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Ubuntu

# Create database
createdb codebattle

# Run schema
psql -d codebattle -f infrastructure/database/schema.sql
```

### Redis Setup

```bash
# Install Redis
brew install redis  # macOS
sudo apt-get install redis  # Ubuntu

# Start Redis
redis-server

# Test connection
redis-cli ping  # Should return "PONG"
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Code Execution Setup

```bash
cd backend/services/code-execution-app
pip install -r requirements.txt
python main.py
```

## Environment Configuration

### Frontend

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

### Backend

Create `backend/.env`:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codebattle
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

## Verification

1. Frontend: http://localhost:3000 ✓
2. Backend API: http://localhost:5000/health ✓
3. Code Execution: http://localhost:8000/health ✓
4. RabbitMQ Management: http://localhost:15672 ✓
5. Elasticsearch: http://localhost:9200 ✓

## Next Steps

- Read `README.md` for project overview
- Check `QUICKSTART.md` for quick start guide
- Explore the codebase structure

