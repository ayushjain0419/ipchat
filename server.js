const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// In-memory store: roomId -> [{ id, username, text, timestamp }]
const rooms = {};
const MESSAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function cleanExpiredMessages(roomId) {
  if (!rooms[roomId]) return;
  const now = Date.now();
  rooms[roomId] = rooms[roomId].filter(m => now - m.timestamp < MESSAGE_TTL);
  if (rooms[roomId].length === 0) delete rooms[roomId];
}

// Track users per room: roomId -> Set of { socketId, username }
const roomUsers = {};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentUsername = null;

  socket.on('join', ({ room, username }) => {
    currentRoom = room.trim();
    currentUsername = username.trim() || 'Anonymous';

    socket.join(currentRoom);

    // Track user
    if (!roomUsers[currentRoom]) roomUsers[currentRoom] = new Map();
    roomUsers[currentRoom].set(socket.id, currentUsername);

    // Clean old messages
    cleanExpiredMessages(currentRoom);

    // Send message history
    const history = rooms[currentRoom] || [];
    socket.emit('history', history);

    // Notify room of new user
    const userCount = roomUsers[currentRoom].size;
    io.to(currentRoom).emit('user_joined', {
      username: currentUsername,
      userCount,
      users: Array.from(roomUsers[currentRoom].values())
    });
  });

  socket.on('message', ({ text }) => {
    if (!currentRoom || !text.trim()) return;

    const msg = {
      id: Date.now() + Math.random().toString(36).slice(2),
      username: currentUsername,
      text: text.trim(),
      timestamp: Date.now()
    };

    if (!rooms[currentRoom]) rooms[currentRoom] = [];
    rooms[currentRoom].push(msg);

    io.to(currentRoom).emit('message', msg);
  });

  socket.on('typing', ({ isTyping }) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit('typing', { username: currentUsername, isTyping });
  });

  socket.on('disconnect', () => {
    if (!currentRoom) return;
    if (roomUsers[currentRoom]) {
      roomUsers[currentRoom].delete(socket.id);
      const userCount = roomUsers[currentRoom].size;
      if (userCount === 0) {
        delete roomUsers[currentRoom];
        delete rooms[currentRoom];
      } else {
        io.to(currentRoom).emit('user_left', {
          username: currentUsername,
          userCount,
          users: Array.from(roomUsers[currentRoom].values())
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`IPChat server running on http://localhost:${PORT}`);
});
