# 🏆 Competitive Arena - Complete Guide

## Overview

The Competitive Arena now features **full room-based competitions** with **AI-powered question generation**! Users can create rooms, invite others, and compete in real-time coding challenges.

---

## 🎯 Features Implemented

### 1. **Competition Rooms** ✅
- Create public or private competition rooms
- Set difficulty level (easy, medium, hard, mixed)
- Configure max participants and time limits
- Real-time participant tracking
- Live leaderboard updates

### 2. **AI-Powered Question Generation** 🤖✅
- Generate coding challenges using GPT-4
- Automatic test case creation
- Multiple difficulty levels
- Support for Python, JavaScript, and Java
- Fallback to template-based generation

### 3. **Real-Time Features** 📡✅
- Live participant updates via Socket.IO
- Real-time score updates
- Competition countdown timer
- Instant submission notifications
- Room chat functionality

### 4. **Code Editor Integration** 💻✅
- Monaco Editor for code writing
- Multiple language support
- Syntax highlighting
- Real-time code submission
- Solution validation

---

## 🚀 How to Use

### Creating a Competition Room

1. **Navigate to Rooms**
   - Go to: http://localhost:3000/arena/challenges
   - Click "View Competition Rooms" button
   - Or directly visit: http://localhost:3000/arena/rooms

2. **Create New Room**
   - Click "Create Room" button
   - Fill in room details:
     - **Name**: Room title
     - **Description**: Brief description
     - **Difficulty**: easy/medium/hard/mixed
     - **Max Participants**: 2-50 players
     - **Time Limit**: Competition duration
     - **Private Room**: Optional room code

3. **AI Question Generation** (Optional)
   - Check "Generate questions using AI"
   - Select number of questions (1-10)
   - AI will create unique challenges based on difficulty

4. **Start Competition**
   - Wait for participants to join
   - Room creator clicks "Start Competition"
   - Timer begins countdown
   - Participants solve challenges

---

## 📡 API Endpoints

### Room Management

#### Get All Rooms
```bash
GET /api/rooms
```
Returns list of active competition rooms

#### Get Room Details
```bash
GET /api/rooms/:id
```
Returns room info and participants

#### Create Room
```bash
POST /api/rooms
Body: {
  "name": "Friday Night Code Battle",
  "description": "Weekly competition",
  "creator_id": "user-id",
  "max_participants": 10,
  "difficulty": "medium",
  "time_limit": 3600,
  "is_private": false
}
```

#### Join Room
```bash
POST /api/rooms/:id/join
Body: {
  "user_id": "user-id",
  "room_code": "optional-for-private"
}
```

#### Start Competition
```bash
POST /api/rooms/:id/start
Body: {
  "creator_id": "user-id"
}
```

#### Submit Solution
```bash
POST /api/rooms/:id/submit
Body: {
  "user_id": "user-id",
  "challenge_id": "challenge-id",
  "code": "solution code",
  "language": "python"
}
```

### AI Question Generation

#### Generate Single Question
```bash
POST /api/ai-questions/generate
Body: {
  "difficulty": "medium",
  "topics": ["algorithms", "data-structures"],
  "count": 1
}
```

#### Generate Batch Questions
```bash
POST /api/ai-questions/generate-batch
Body: {
  "difficulty": "hard",
  "topics": ["dynamic-programming"],
  "count": 5
}
```

#### Generate for Room
```bash
POST /api/ai-questions/generate-for-room/:roomId
Body: {
  "difficulty": "medium",
  "count": 3
}
```

---

## 🔧 Database Schema

### Competition Rooms
```sql
CREATE TABLE competition_rooms (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id),
    max_participants INTEGER DEFAULT 10,
    difficulty VARCHAR(20),
    time_limit INTEGER DEFAULT 3600,
    is_private BOOLEAN DEFAULT FALSE,
    room_code VARCHAR(20),
    status VARCHAR(20) DEFAULT 'waiting',
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Room Participants
```sql
CREATE TABLE room_participants (
    room_id UUID REFERENCES competition_rooms(id),
    user_id UUID REFERENCES users(id),
    score INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    rank INTEGER,
    is_ready BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, user_id)
);
```

---

## 🎮 Socket.IO Events

### Client → Server

#### Join Room
```javascript
socket.emit('join-room', {
  roomId: 'room-uuid',
  userId: 'user-uuid',
  username: 'John Doe'
})
```

#### Leave Room
```javascript
socket.emit('leave-room', {
  roomId: 'room-uuid',
  userId: 'user-uuid',
  username: 'John Doe'
})
```

#### Toggle Ready Status
```javascript
socket.emit('toggle-ready', {
  roomId: 'room-uuid',
  userId: 'user-uuid',
  isReady: true
})
```

#### Submit Code
```javascript
socket.emit('room-submission', {
  roomId: 'room-uuid',
  userId: 'user-uuid',
  username: 'John Doe',
  challengeId: 'challenge-uuid',
  status: 'accepted',
  score: 100,
  language: 'python'
})
```

#### Send Chat Message
```javascript
socket.emit('room-chat', {
  roomId: 'room-uuid',
  userId: 'user-uuid',
  username: 'John Doe',
  message: 'Good luck everyone!'
})
```

### Server → Client

#### User Joined
```javascript
socket.on('user-joined-room', (data) => {
  // { userId, username, roomId, timestamp }
})
```

#### User Left
```javascript
socket.on('user-left-room', (data) => {
  // { userId, username, roomId, timestamp }
})
```

#### Leaderboard Update
```javascript
socket.on('leaderboard-update', (data) => {
  // { userId, score, problemsSolved, timestamp }
})
```

#### Competition Started
```javascript
socket.on('competition-started', (data) => {
  // { room_id, started_at }
})
```

#### Countdown Update
```javascript
socket.on('countdown-update', (data) => {
  // { countdown, timestamp }
})
```

---

## 🤖 AI Question Generator

### Configuration

The AI question generator uses OpenAI GPT-4. To enable it:

1. Get an OpenAI API key from https://platform.openai.com/
2. Add to backend `.env`:
```env
OPENAI_API_KEY=your-api-key-here
```

### Fallback Mode

If OpenAI API fails or is not configured, the system automatically falls back to template-based question generation with predefined challenges.

### Question Structure

Generated questions include:
- **Title**: Clear problem name
- **Description**: Detailed explanation with examples
- **Test Cases**: 3 public + 2 hidden test cases
- **Solution Templates**: Python, JavaScript, Java
- **Hints**: 2-3 progressive hints
- **Difficulty Rating**: Points based on difficulty
- **Tags**: Topic classifications

---

## 🎨 Frontend Components

### Room List Page
**Location**: `/arena/rooms`
- View all active rooms
- Filter by status/difficulty
- Create new rooms
- Quick join feature

### Room Detail Page
**Location**: `/arena/rooms/[id]`
- Live participant list
- Real-time leaderboard
- Code editor for solving challenges
- Timer countdown
- Challenge selector
- Submit solutions

### Create Room Modal
- Form for room configuration
- AI question generation toggle
- Privacy settings
- Validation

---

## 📊 Leaderboard Scoring

### Point System
- **Easy**: 10 points
- **Medium**: 20 points
- **Hard**: 30 points

### Ranking Criteria
1. Total Score (primary)
2. Problems Solved (secondary)
3. Time of submission (tiebreaker)

### Real-Time Updates
- Scores update instantly via WebSocket
- Leaderboard re-sorts automatically
- Visual indicators for top 3 positions

---

## 🔐 Security Features

1. **Room Access Control**
   - Private rooms require codes
   - Creator-only start permission
   - Participant limits enforced

2. **Code Execution**
   - Sandboxed environment
   - Time/memory limits
   - Input validation

3. **API Protection**
   - Rate limiting (TODO: implement)
   - Authentication (TODO: implement JWT)
   - SQL injection prevention

---

## 🧪 Testing the Features

### Test Room Creation
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Room",
    "description": "Testing competition rooms",
    "creator_id": "test-user",
    "difficulty": "medium",
    "max_participants": 5,
    "time_limit": 1800
  }'
```

### Test AI Question Generation
```bash
curl -X POST http://localhost:5000/api/ai-questions/generate \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "easy",
    "topics": ["arrays"],
    "count": 1
  }'
```

### Test Room Join
```bash
curl -X POST http://localhost:5000/api/rooms/ROOM_ID/join \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-2"
  }'
```

---

## 🚀 Future Enhancements

### Phase 2 (Recommended)
- [ ] User authentication with JWT
- [ ] Persistent user profiles
- [ ] Historical competition records
- [ ] Replay functionality
- [ ] Advanced analytics dashboard

### Phase 3
- [ ] Team competitions
- [ ] Tournament brackets
- [ ] Spectator mode
- [ ] Code review features
- [ ] Video chat integration

### Phase 4
- [ ] Mobile app
- [ ] Streaming integration
- [ ] Sponsorship system
- [ ] Prize pool management

---

## 🐛 Troubleshooting

### Room Not Loading
- Check if backend is running: `curl http://localhost:5000/health`
- Verify database connection
- Check browser console for errors

### AI Questions Not Generating
- Verify OpenAI API key in `.env`
- Check API quota/billing
- System will fallback to templates automatically

### WebSocket Issues
- Ensure Socket.IO is connected
- Check browser console for connection errors
- Verify CORS settings

### Code Submission Failing
- Check challenge ID exists
- Verify code format
- Review backend logs: `tail -f /tmp/backend.log`

---

## 📝 Notes

- **Demo Mode**: Currently uses `'demo-user-id'` for testing
- **Authentication**: JWT integration recommended for production
- **OpenAI**: Optional - works without API key using templates
- **Scaling**: Redis pub/sub recommended for multi-server setup

---

## 🎉 Congratulations!

Your CodeBattle Arena now has a fully functional competitive programming environment with:
- ✅ Real-time competition rooms
- ✅ AI-powered question generation
- ✅ Live leaderboards
- ✅ Code editor integration
- ✅ WebSocket real-time updates

**Ready to compete!** 🚀

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check backend logs
4. Test with provided curl commands

**Happy Coding!** 💻⚔️

