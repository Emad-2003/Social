//modules 
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const http = require('http'); // Required to create an HTTP server

const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`));

const { Server } = require('socket.io'); // Updated for Socket.io v4
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

//set of all unique socket ids
let socketsConnected = new Set();

//handles websocket connection / disconnection 
io.on('connection', (socket) => {
  console.log('socket id ', socket.id,"connected");
  socketsConnected.add(socket.id);
  io.emit('clients-total', socketsConnected.size);

  //when socket disconnected 
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
