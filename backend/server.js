const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {};

app.use(express.static(path.join(__dirname, '../frontend')));

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('create-room', (name) => {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    rooms[roomCode] = [{ id: socket.id, name }];
    socket.join(roomCode);
    console.log(`Room created: ${roomCode} by ${name}`);
    socket.emit('room-created', roomCode); // ✅ Emit room code to the creator
  });

  socket.on('join-room', ({ roomCode, name }) => {
    if (rooms[roomCode]) {
      socket.join(roomCode);
      rooms[roomCode].push({ id: socket.id, name });
      socket.emit('room-joined', roomCode);
      io.to(roomCode).emit('user-joined', `${name} joined the room`);
    } else {
      socket.emit('error', 'Room does not exist'); // ✅ Emit error if room doesn't exist
    }
  });

  socket.on('send-message', ({ roomCode, name, message }) => {
    io.to(roomCode).emit('receive-message', `${name}: ${message}`);
  });

  socket.on('disconnect', () => {
    for (const roomCode in rooms) {
      rooms[roomCode] = rooms[roomCode].filter((user) => user.id !== socket.id);
      if (rooms[roomCode].length === 0) delete rooms[roomCode];
    }
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
