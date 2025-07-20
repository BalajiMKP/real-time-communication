const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/uploads', express.static('public/uploads'));

// Real-time WebRTC signaling
io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });

    socket.on('message', (msg) => {
      socket.to(roomId).emit('createMessage', msg);
    });

    socket.on('whiteboard-draw', data => {
      socket.to(roomId).emit('draw-data', data);
    });

    socket.on('file-upload', (data) => {
      socket.to(roomId).emit('file-share', data);
    });
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
