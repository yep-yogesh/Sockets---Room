const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {};

app.use(express.static(path.join(__dirname, 'frontend'))); // ✅ Serve frontend files

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ room, name }) => {
        socket.join(room);
        if (!rooms[room]) rooms[room] = [];
        rooms[room].push({ id: socket.id, name });
        console.log(`${name} joined room ${room}`);

        // Broadcast to other users
        socket.to(room).emit('user-joined', name);

        socket.on('message', (message) => {
            io.to(room).emit('message', { name, message });
        });

        socket.on('disconnect', () => {
            rooms[room] = rooms[room].filter(user => user.id !== socket.id);
            socket.to(room).emit('user-left', name);
            console.log(`${name} left room ${room}`);
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html')); // ✅ Serve index.html for any unknown route
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
