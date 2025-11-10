# CodeBattle Arena - Competitive Coding & Learning Platform

A gamified platform where developers compete in coding challenges, learn new technologies, collaborate in communities, and automate workflows with integrated automation tools.

## 🚀 Features

### ⚔️ Competitive Arena
- **Real-time Coding Challenges**: Solve problems with live validation
- **Competitions**: Participate in timed competitions
- **Tournaments**: Multi-round elimination tournaments
- **Leaderboards**: Track your ranking globally

### 📚 Learning Platform
- **Structured Learning Paths**: Follow guided courses
- **Interactive Lessons**: Hands-on coding exercises
- **Progress Tracking**: Monitor your learning journey
- **Certifications**: Earn badges and certificates

### 🤖 Workflow Automation
- **Visual Builder**: Drag-and-drop workflow designer
- **n8n-like Engine**: Powerful automation capabilities
- **Pre-built Templates**: Quick start with templates
- **Custom Nodes**: Create your own automation nodes

### 👥 Community
- **Discussions**: Engage in tech discussions
- **Collaboration**: Code together in real-time
- **Mentorship**: Connect with experienced developers
- **Contribute**: Share your knowledge

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with TypeScript
- **React Flow** for workflow automation
- **Monaco Editor** for code editing
- **Socket.IO Client** for real-time features
- **Tailwind CSS** with animations
- **Framer Motion** for smooth animations
- **Agora RTC** for live collaboration

### Backend
- **Node.js** with Express & TypeScript
- **Python FastAPI** for code execution
- **PostgreSQL** with connection pooling
- **Redis** for caching and sessions
- **RabbitMQ** for message queue
- **Elasticsearch** for search
- **WebSocket** for real-time features
- **Docker** for code execution sandbox

### AI & Automation
- **OpenAI GPT-4** for code review & assistance
- **Custom Workflow Engine** for automation
- **Git Integration** for version control
- **Code Analysis Tools** (ESLint, Pylint, etc.)

## 📁 Project Structure

```
codebattle-platform/
├── frontend/                 # Next.js 15 frontend
│   ├── app/                 # App router pages
│   │   ├── (arena)/        # Competition area
│   │   ├── learn/          # Learning paths
│   │   ├── automate/       # Workflow automation
│   │   ├── community/      # Discussions & groups
│   │   └── challenges/     # Challenge library
│   ├── components/         # React components
│   │   ├── arena/
│   │   ├── code-editor/
│   │   ├── automation-builder/
│   │   ├── community/
│   │   └── learning/
│   └── lib/                # Utilities
├── backend/                # Express backend
│   ├── services/
│   │   ├── code-execution/
│   │   ├── real-time/
│   │   ├── automation-engine/
│   │   ├── ai-assistant/
│   │   └── notification/
│   ├── api/                # API routes
│   └── database/           # Database configs
├── automation-engine/      # Workflow engine
│   ├── nodes/
│   ├── workflows/
│   └── triggers/
└── infrastructure/         # Infrastructure configs
    ├── docker/
    ├── kubernetes/
    └── monitoring/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- Python 3.11+ (for code execution service)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codebattle-platform
   ```

2. **Start infrastructure services**
   ```bash
   cd infrastructure/docker
   docker-compose up -d
   ```

3. **Set up the database**
   ```bash
   # Connect to PostgreSQL and run schema
   psql -U postgres -d codebattle -f ../database/schema.sql
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

5. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

6. **Set up environment variables**
   ```bash
   # Frontend: Create .env.local
   cd frontend
   cp .env.example .env.local
   
   # Backend: Create .env
   cd backend
   cp .env.example .env
   ```

7. **Start development servers**
   ```bash
   # Terminal 1: Frontend
   cd frontend
   npm run dev
   
   # Terminal 2: Backend
   cd backend
   npm run dev
   
   # Terminal 3: Code Execution Service
   cd backend/services/code-execution-app
   pip install -r requirements.txt
   python main.py
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Code Execution: http://localhost:8000
   - RabbitMQ Management: http://localhost:15672
   - Elasticsearch: http://localhost:9200

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codebattle
DB_USER=postgres
DB_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## 🎮 Usage

### As a Participant

1. **Register/Login** to create your account
2. **Browse Challenges** and select one to solve
3. **Code your solution** in the integrated editor
4. **Submit** and get instant feedback
5. **Climb the leaderboard** by solving more challenges

### As a Learner

1. **Explore Learning Paths** in the learn section
2. **Enroll** in courses that interest you
3. **Complete lessons** and track your progress
4. **Earn certificates** upon completion

### As a Developer

1. **Create Workflows** in the automation builder
2. **Use pre-built nodes** or create custom ones
3. **Deploy automations** to improve productivity
4. **Share workflows** with the community

## 🔐 Security

- **Input Sanitization**: All user inputs are validated and sanitized
- **Docker Sandboxing**: Code execution happens in isolated containers
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin settings

## 📊 Performance

- **Redis Caching**: Fast data retrieval
- **Connection Pooling**: Efficient database connections
- **CDN Ready**: Static assets can be served via CDN
- **Elasticsearch**: Fast full-text search
- **WebSocket**: Efficient real-time communication

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React Flow for workflow visualization
- Monaco Editor team for the code editor
- All open-source contributors

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by the CodeBattle team

# code_battle-arena
