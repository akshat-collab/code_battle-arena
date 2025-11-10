# Quick Start Guide

Get CodeBattle Arena up and running in minutes!

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

## Installation Steps

### 1. Clone and Navigate

```bash
cd codebattle-platform
```

### 2. Start Infrastructure Services

```bash
cd infrastructure/docker
docker-compose up -d postgres redis rabbitmq elasticsearch
```

Wait for services to be healthy:
```bash
docker-compose ps
```

### 3. Initialize Database

```bash
# Connect to PostgreSQL and run schema
psql -U postgres -d codebattle -f ../database/schema.sql
```

Or using Docker:
```bash
docker exec -i codebattle-postgres psql -U postgres -d codebattle < ../database/schema.sql
```

### 4. Setup Frontend

```bash
cd ../../frontend
npm install
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run at: http://localhost:3000

### 5. Setup Backend

```bash
cd ../backend
npm install
cp .env.example .env

# Start development server
npm run dev
```

Backend will run at: http://localhost:5000

### 6. Setup Code Execution Service

```bash
cd services/code-execution-app
pip install -r requirements.txt

# Make sure Docker is running
python main.py
```

Code execution service will run at: http://localhost:8000

## Testing the Setup

1. Open http://localhost:3000
2. You should see the CodeBattle Arena homepage
3. Navigate to:
   - `/arena/challenges` - Browse challenges
   - `/learn` - Explore learning paths
   - `/automate` - Try workflow builder
   - `/community` - Visit community

## API Testing

```bash
# Health check
curl http://localhost:5000/health

# Get supported languages
curl http://localhost:8000/languages

# Test code execution
curl -X POST http://localhost:8000/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello, CodeBattle!\")",
    "language": "python",
    "timeout": 10
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :3000  # or 5000, 8000, etc.
kill -9 <PID>
```

### Docker Issues
```bash
# Restart Docker
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Database Connection Issues
- Verify PostgreSQL is running: `docker ps`
- Check credentials in `.env`
- Test connection: `psql -U postgres -d codebattle`

### Redis Connection Issues
- Verify Redis is running: `docker ps`
- Test connection: `redis-cli ping`

## Next Steps

1. Create your first user account
2. Add sample challenges to database
3. Explore the automation builder
4. Set up workflows
5. Invite users to your platform!

## Production Deployment

For production deployment, see `README.md` for:
- Docker containerization
- Kubernetes configurations
- CI/CD setup
- Monitoring and logging

## Need Help?

- Check `README.md` for detailed documentation
- Open an issue on GitHub
- Contact support

Happy coding! 🚀

