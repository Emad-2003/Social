const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const http = require('http'); // Required to create an HTTP server

const server = http.createServer(app);
server.listen(PORT, () => console.log(`💬 server on port ${PORT}`));

const { Server } = require('socket.io'); // Updated for Socket.io v4
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();

//handles websocket connection / disconnection 
io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socketsConnected.add(socket.id);
  io.emit('clients-total', socketsConnected.size);

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
    socketsConnected.delete(socket.id);
    io.emit('clients-total', socketsConnected.size);
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('chat-message', data);
  });

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data);
  });
});
