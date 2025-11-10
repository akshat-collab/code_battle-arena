-- Competition Rooms Schema Extension

-- Competition Rooms table
CREATE TABLE IF NOT EXISTS competition_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    max_participants INTEGER DEFAULT 10,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
    time_limit INTEGER DEFAULT 3600, -- in seconds
    is_private BOOLEAN DEFAULT FALSE,
    room_code VARCHAR(20), -- for private rooms
    status VARCHAR(20) NOT NULL CHECK (status IN ('waiting', 'ongoing', 'completed', 'cancelled')) DEFAULT 'waiting',
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Participants table
CREATE TABLE IF NOT EXISTS room_participants (
    room_id UUID REFERENCES competition_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    rank INTEGER,
    is_ready BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, user_id)
);

-- Room Challenges (problems assigned to rooms)
CREATE TABLE IF NOT EXISTS room_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES competition_rooms(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    order_index INTEGER,
    points_multiplier DECIMAL DEFAULT 1.0,
    time_bonus_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Chat Messages
CREATE TABLE IF NOT EXISTS room_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES competition_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_rooms_status ON competition_rooms(status);
CREATE INDEX idx_rooms_creator ON competition_rooms(creator_id);
CREATE INDEX idx_room_participants_user ON room_participants(user_id);
CREATE INDEX idx_room_participants_score ON room_participants(score DESC);
CREATE INDEX idx_room_challenges_room ON room_challenges(room_id);
CREATE INDEX idx_room_chat_room ON room_chat_messages(room_id);

-- Function to update room status based on time
CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.started_at IS NOT NULL AND 
       NEW.started_at + (NEW.time_limit || ' seconds')::INTERVAL < NOW() AND
       NEW.status = 'ongoing' THEN
        NEW.status = 'completed';
        NEW.ended_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-complete rooms
CREATE TRIGGER check_room_completion
    BEFORE UPDATE ON competition_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_room_status();

