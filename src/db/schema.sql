CREATE TABLE IF NOT EXISTS rooms (
  pin TEXT PRIMARY KEY,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS participants (
  room_pin TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  duck_id TEXT NOT NULL,
  battle_cry TEXT,
  joined_at INTEGER,
  last_boost_at INTEGER,
  PRIMARY KEY (room_pin, participant_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_room ON participants(room_pin);
CREATE INDEX IF NOT EXISTS idx_participants_joined ON participants(joined_at);

